import React from "react";
import {
  useTable,
  useCreate,
  useDelete,
} from "@refinedev/core";
import {
  Table,
  Typography,
  Space,
  Button,
  Card,
  Popconfirm,
  App,
  Tooltip,
  Form,
  Modal,
  Select,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export const EnrollmentList: React.FC = () => {
  const { message } = App.useApp();
  const {
    tableQueryResult,
    setCurrent,
    setPageSize,
    current,
    pageSize,
  } = useTable({
    resource: "enrollments",
    syncWithLocation: true,
  });

  const { mutate: deleteRecord, isLoading: isDeleting } = useDelete();
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [createForm] = Form.useForm();

  const { data, isLoading } = tableQueryResult;
  const { mutate: createRecord, isLoading: isCreating } = useCreate();

  const { data: studentsData } = useTable({
    resource: "students",
    pagination: { pageSize: 100 },
  });

  const { data: coursesData } = useTable({
    resource: "courses",
    pagination: { pageSize: 100 },
  });

  const students = studentsData?.data || [];
  const courses = coursesData?.data || [];

  const handleDelete = (id: string) => {
    deleteRecord(
      { resource: "enrollments", id },
      {
        onSuccess: () => message.success("Enrollment deleted successfully"),
        onError: (error: any) =>
          message.error(error?.message || "Failed to delete enrollment"),
      }
    );
  };

  const handleCreate = (values: any) => {
    createRecord(
      { resource: "enrollments", values },
      {
        onSuccess: () => {
          message.success("Enrollment created successfully");
          setCreateModalOpen(false);
          createForm.resetFields();
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to create enrollment"),
      }
    );
  };

  const columns = [
    {
      title: "Student",
      key: "student",
      render: (_: any, record: any) => (
        <div>
          <Text strong>{record.student?.user?.name || "N/A"}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.student?.major || ""}
          </Text>
        </div>
      ),
    },
    {
      title: "Course",
      key: "course",
      render: (_: any, record: any) => (
        <Tag color="blue">{record.course?.title || "N/A"}</Tag>
      ),
    },
    {
      title: "Enrolled",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_: any, record: any) => (
        <Popconfirm
          title="Remove this enrollment?"
          onConfirm={() => handleDelete(record.id)}
          okText="Remove"
          cancelText="Cancel"
          okButtonProps={{ danger: true, loading: isDeleting }}
        >
          <Tooltip title="Remove enrollment">
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Enrollments</Title>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Add Enrollment
          </Button>
        }
        style={{ borderRadius: 8 }}
      >
        <Table
          dataSource={data?.data || []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current,
            pageSize,
            total: data?.meta?.total || 0,
            showSizeChanger: true,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size);
            },
          }}
        />
      </Card>

      <Modal
        title="Create Enrollment"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          createForm.resetFields();
        }}
        footer={null}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreate}>
          <Form.Item
            name="studentId"
            label="Student"
            rules={[{ required: true, message: "Student is required" }]}
          >
            <Select
              placeholder="Select a student"
              showSearch
              optionFilterProp="children"
            >
              {students.map((student: any) => (
                <Select.Option key={student.id} value={student.id}>
                  {student.user?.name || "Unknown"} - {student.major}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: "Course is required" }]}
          >
            <Select
              placeholder="Select a course"
              showSearch
              optionFilterProp="children"
            >
              {courses.map((course: any) => (
                <Select.Option key={course.id} value={course.id}>
                  {course.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isCreating}>
                Enroll
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export const EnrollmentCreate: React.FC = () => {
  const { mutate: createRecord, isLoading } = useCreate();
  const { message } = App.useApp();

  const { data: studentsData } = useTable({
    resource: "students",
    pagination: { pageSize: 100 },
  });

  const { data: coursesData } = useTable({
    resource: "courses",
    pagination: { pageSize: 100 },
  });

  const students = studentsData?.data || [];
  const courses = coursesData?.data || [];

  const onFinish = (values: any) => {
    createRecord(
      { resource: "enrollments", values },
      {
        onSuccess: () => {
          message.success("Enrollment created successfully");
          window.location.href = "/enrollments";
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to create enrollment"),
      }
    );
  };

  return (
    <Card title="Create Enrollment" style={{ borderRadius: 8 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="studentId"
          label="Student"
          rules={[{ required: true, message: "Student is required" }]}
        >
          <Select placeholder="Select a student" showSearch optionFilterProp="children">
            {students.map((student: any) => (
              <Select.Option key={student.id} value={student.id}>
                {student.user?.name || "Unknown"} - {student.major}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="courseId"
          label="Course"
          rules={[{ required: true, message: "Course is required" }]}
        >
          <Select placeholder="Select a course" showSearch optionFilterProp="children">
            {courses.map((course: any) => (
              <Select.Option key={course.id} value={course.id}>
                {course.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={() => (window.location.href = "/enrollments")}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Enroll
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
