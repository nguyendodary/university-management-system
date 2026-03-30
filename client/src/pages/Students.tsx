import React from "react";
import {
  useTable,
  useCreate,
  useUpdate,
  useShow,
  useDelete,
  useGetToPath,
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
  Select,
  Avatar,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const getToPath = useGetToPath();
  const { message } = App.useApp();

  const {
    tableQueryResult,
    setCurrent,
    setPageSize,
    current,
    pageSize,
  } = useTable({
    resource: "students",
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

  const { data: usersData } = useTable({
    resource: "users",
    pagination: { pageSize: 100 },
  });

  const studentUsers =
    usersData?.data?.filter((u: any) => u.role === "student") || [];

  const handleDelete = (id: string) => {
    deleteRecord(
      { resource: "students", id },
      {
        onSuccess: () => message.success("Student deleted successfully"),
        onError: (error: any) =>
          message.error(error?.message || "Failed to delete student"),
      }
    );
  };

  const handleCreate = (values: any) => {
    createRecord(
      { resource: "students", values },
      {
        onSuccess: () => {
          message.success("Student created successfully");
          setCreateModalOpen(false);
          createForm.resetFields();
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to create student"),
      }
    );
  };

  const handleUpdate = (values: any) => {
    updateRecord(
      { resource: "students", id: editingRecord.id, values },
      {
        onSuccess: () => {
          message.success("Student updated successfully");
          setEditModalOpen(false);
          setEditingRecord(null);
          editForm.resetFields();
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to update student"),
      }
    );
  };

  const openEditModal = (record: any) => {
    setEditingRecord(record);
    editForm.setFieldsValue({ major: record.major });
    setEditModalOpen(true);
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: ["user", "avatarUrl"],
      key: "avatar",
      width: 80,
      render: (avatar: string) => (
        <Avatar
          src={avatar}
          icon={!avatar && <UserOutlined />}
          size={40}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: ["user", "name"],
      key: "name",
      render: (text: string) => <Text strong>{text || "N/A"}</Text>,
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
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
      width: 160,
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
                    resource: "students",
                    id: record.id,
                  }) || `/students/show/${record.id}`
                )
              }
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeleting }}
          >
            <Tooltip title="Delete">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={<Title level={4} style={{ margin: 0 }}>Students</Title>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
          >
            Add Student
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
        title="Create Student"
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
            name="userId"
            label="User"
            rules={[{ required: true, message: "User is required" }]}
          >
            <Select
              placeholder="Select a user"
              showSearch
              optionFilterProp="children"
            >
              {studentUsers.map((user: any) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="major"
            label="Major"
            rules={[{ required: true, message: "Major is required" }]}
          >
            <Input placeholder="e.g., Computer Science" />
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
        title="Edit Student"
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
            name="major"
            label="Major"
            rules={[{ required: true, message: "Major is required" }]}
          >
            <Input placeholder="e.g., Computer Science" />
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
  );
};

export const StudentCreate: React.FC = () => {
  const { mutate: createRecord, isLoading } = useCreate();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { data: usersData } = useTable({
    resource: "users",
    pagination: { pageSize: 100 },
  });

  const studentUsers =
    usersData?.data?.filter((u: any) => u.role === "student") || [];

  const onFinish = (values: any) => {
    createRecord(
      { resource: "students", values },
      {
        onSuccess: () => {
          message.success("Student created successfully");
          navigate("/students");
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to create student"),
      }
    );
  };

  return (
    <Card title="Create Student" style={{ borderRadius: 8 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="userId"
          label="User"
          rules={[{ required: true, message: "User is required" }]}
        >
          <Select placeholder="Select a user" showSearch optionFilterProp="children">
            {studentUsers.map((user: any) => (
              <Select.Option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="major"
          label="Major"
          rules={[{ required: true, message: "Major is required" }]}
        >
          <Input placeholder="e.g., Computer Science" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={() => navigate("/students")}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export const StudentEdit: React.FC = () => {
  const { queryResult } = useShow({ resource: "students" });
  const { mutate: updateRecord, isLoading } = useUpdate();
  const navigate = useNavigate();
  const record = queryResult?.data?.data;
  const { message } = App.useApp();

  const onFinish = (values: any) => {
    updateRecord(
      { resource: "students", id: record?.id, values },
      {
        onSuccess: () => {
          message.success("Student updated successfully");
          navigate("/students");
        },
        onError: (error: any) =>
          message.error(error?.message || "Failed to update student"),
      }
    );
  };

  return (
    <Card title="Edit Student" style={{ borderRadius: 8 }} loading={!record}>
      {record && (
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ major: record.major }}
        >
          <Form.Item
            name="major"
            label="Major"
            rules={[{ required: true, message: "Major is required" }]}
          >
            <Input placeholder="e.g., Computer Science" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => navigate("/students")}>Cancel</Button>
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

export const StudentShow: React.FC = () => {
  const { queryResult } = useShow({ resource: "students" });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Card
      title={<Title level={4} style={{ margin: 0 }}>Student Details</Title>}
      loading={isLoading}
      style={{ borderRadius: 8 }}
    >
      {record && (
        <div style={{ display: "flex", gap: 32 }}>
          <Avatar
            src={record.user?.avatarUrl}
            icon={!record.user?.avatarUrl && <UserOutlined />}
            size={120}
          />
          <div>
            <Title level={4}>{record.user?.name || "N/A"}</Title>
            <Text type="secondary">{record.user?.email || "N/A"}</Text>
            <br />
            <Text strong style={{ marginTop: 8, display: "block" }}>
              Major: {record.major}
            </Text>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Created:{" "}
                {record.createdAt
                  ? new Date(record.createdAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
