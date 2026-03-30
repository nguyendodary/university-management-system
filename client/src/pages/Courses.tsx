import React from "react";
import {
  useTable,
  useCreate,
  useUpdate,
  useShow,
  useDelete,
  useGetToPath,
  useGetIdentity,
} from "@refinedev/core";
import {
  Table,
  Typography,
  Space,
  Button,
  Input,
  Card,
  Popconfirm,
  App,
  Tooltip,
  Form,
  Modal,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export const CourseList: React.FC = () => {
  const navigate = useNavigate();
  const getToPath = useGetToPath();
  const { message } = App.useApp();
  const { data: user } = useGetIdentity<any>();

  const userRole = user?.role || "student";
  const canEdit = userRole === "admin" || userRole === "teacher";
  const canDelete = userRole === "admin";

  const {
    tableQueryResult,
    setCurrent,
    setPageSize,
    current,
    pageSize,
  } = useTable({
    resource: "courses",
    syncWithLocation: true,
  });

  const { mutate: deleteRecord, isLoading: isDeleting } = useDelete();
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editingRecord, setEditingRecord] = React.useState<any>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, isLoading } = tableQueryResult;

  const { mutate: createRecord, isLoading: isCreating } = useCreate();
  const { mutate: updateRecord, isLoading: isUpdating } = useUpdate();

  const handleDelete = (id: string) => {
    deleteRecord(
      { resource: "courses", id },
      {
        onSuccess: () => message.success("Course deleted successfully"),
        onError: (error: any) =>
          message.error(error?.message || "Failed to delete course"),
      }
    );
  };

  const handleCreate = (values: any) => {
    createRecord(
      { resource: "courses", values },
      {
        onSuccess: () => {
          message.success("Course created successfully");
          setCreateModalOpen(false);
          createForm.resetFields();
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to create course"),
      }
    );
  };

  const handleUpdate = (values: any) => {
    updateRecord(
      { resource: "courses", id: editingRecord.id, values },
      {
        onSuccess: () => {
          message.success("Course updated successfully");
          setEditModalOpen(false);
          setEditingRecord(null);
          editForm.resetFields();
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to update course"),
      }
    );
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      title: record.title,
      description: record.description,
    });
    setEditModalOpen(true);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => text || <Text type="secondary">No description</Text>,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      width: canEdit ? 160 : 80,
      render: (_: any, record: any) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() =>
                navigate(
                  getToPath({
                    action: "show",
                    resource: "courses",
                    id: record.id,
                  }) || `/courses/show/${record.id}`
                )
              }
            />
          </Tooltip>
          {canEdit && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
              />
            </Tooltip>
          )}
          {canDelete && (
            <Popconfirm
              title="Delete this course?"
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true, loading: isDeleting }}
            >
              <Tooltip title="Delete">
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Courses</Title>}
        extra={
          canEdit ? (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalOpen(true)}
            >
              Add Course
            </Button>
          ) : null
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

      {canEdit && (
        <>
          <Modal
            title="Create Course"
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
                name="title"
                label="Title"
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Input placeholder="Course title" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={4} placeholder="Course description" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={isCreating}>
                    Create
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          <Modal
            title="Edit Course"
            open={editModalOpen}
            onCancel={() => {
              setEditModalOpen(false);
              setEditingRecord(null);
              editForm.resetFields();
            }}
            footer={null}
            destroyOnHidden
          >
            <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Title is required" }]}
              >
                <Input placeholder="Course title" />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <TextArea rows={4} placeholder="Course description" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    onClick={() => {
                      setEditModalOpen(false);
                      setEditingRecord(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit" loading={isUpdating}>
                    Update
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
};

export const CourseCreate: React.FC = () => {
  const { mutate: createRecord, isLoading } = useCreate();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = (values: any) => {
    createRecord(
      { resource: "courses", values },
      {
        onSuccess: () => {
          message.success("Course created successfully");
          navigate("/courses");
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to create course"),
      }
    );
  };

  return (
    <Card title="Create Course" style={{ borderRadius: 8 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Course title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Course description" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={() => navigate("/courses")}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export const CourseEdit: React.FC = () => {
  const { queryResult } = useShow({ resource: "courses" });
  const { mutate: updateRecord, isLoading } = useUpdate();
  const navigate = useNavigate();
  const record = queryResult?.data?.data;
  const { message } = App.useApp();

  const onFinish = (values: any) => {
    updateRecord(
      { resource: "courses", id: record?.id, values },
      {
        onSuccess: () => {
          message.success("Course updated successfully");
          navigate("/courses");
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to update course"),
      }
    );
  };

  return (
    <Card title="Edit Course" style={{ borderRadius: 8 }} loading={!record}>
      {record && (
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            title: record.title,
            description: record.description,
          }}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Title is required" }]}
          >
            <Input placeholder="Course title" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Course description" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => navigate("/courses")}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );
};

export const CourseShow: React.FC = () => {
  const { queryResult } = useShow({ resource: "courses" });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Card
      title={<Title level={4} style={{ margin: 0 }}>Course Details</Title>}
      loading={isLoading}
      style={{ borderRadius: 8 }}
    >
      {record && (
        <div>
          <Title level={4}>{record.title}</Title>
          <Paragraph type="secondary">
            {record.description || "No description provided"}
          </Paragraph>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              Created:{" "}
              {record.createdAt
                ? new Date(record.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};
