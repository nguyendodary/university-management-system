import React from "react";
import {
  useTable,
  useShow,
  useDelete,
  useGetToPath,
} from "@refinedev/core";
import {
  Table,
  Typography,
  Tag,
  Avatar,
  Space,
  Button,
  Input,
  Card,
  Popconfirm,
  App,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const roleColors: Record<string, string> = {
  admin: "red",
  teacher: "green",
  student: "blue",
};

export const UserList: React.FC = () => {
  const navigate = useNavigate();
  const getToPath = useGetToPath();
  const { message } = App.useApp();

  const {
    tableQueryResult,
    filters,
    setFilters,
    setCurrent,
    setPageSize,
    current,
    pageSize,
  } = useTable({
    resource: "users",
    syncWithLocation: true,
  });

  const { mutate: deleteRecord, isLoading: isDeleting } = useDelete();

  const { data, isLoading } = tableQueryResult;

  const handleDelete = (id: string) => {
    deleteRecord(
      {
        resource: "users",
        id,
      },
      {
        onSuccess: () => {
          message.success("User deleted successfully");
        },
        onError: (error: any) => {
          message.error(error?.message || "Failed to delete user");
        },
      }
    );
  };

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatarUrl",
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
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={roleColors[role] || "default"}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Admin", value: "admin" },
        { text: "Teacher", value: "teacher" },
        { text: "Student", value: "student" },
      ],
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
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
                    resource: "users",
                    id: record.id,
                  }) || `/users/show/${record.id}`
                )
              }
            />
          </Tooltip>
          <Popconfirm
            title="Delete this user?"
            description="This action cannot be undone."
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
    <Card
      title={<Title level={4} style={{ margin: 0 }}>Users</Title>}
      extra={
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          allowClear
          onChange={(e) => {
            setFilters(
              [{ field: "search", operator: "contains", value: e.target.value }],
              "replace"
            );
          }}
        />
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
  );
};

export const UserShow: React.FC = () => {
  const { queryResult } = useShow({ resource: "users" });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Card
      title={<Title level={4} style={{ margin: 0 }}>User Details</Title>}
      loading={isLoading}
      style={{ borderRadius: 8 }}
    >
      {record && (
        <div style={{ display: "flex", gap: 32 }}>
          <Avatar
            src={record.avatarUrl}
            icon={!record.avatarUrl && <UserOutlined />}
            size={120}
          />
          <div>
            <Title level={4}>{record.name}</Title>
            <Text type="secondary">{record.email}</Text>
            <br />
            <Tag
              color={roleColors[record.role] || "default"}
              style={{ marginTop: 8 }}
            >
              {record.role?.toUpperCase()}
            </Tag>
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
