import React from "react";
import { useCustom, useGetIdentity } from "@refinedev/core";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
  Spin,
  Tag,
  Empty,
} from "antd";
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface DashboardData {
  stats: {
    totalUsers: number;
    totalStudents: number;
    totalCourses: number;
    totalEnrollments: number;
  };
  roleDistribution: { role: string; count: number }[];
  recentEnrollments: {
    id: string;
    createdAt: string;
    student: { name: string } | null;
    course: { title: string } | null;
  }[];
  topCourses: {
    id: string;
    title: string;
    enrollmentCount: number;
  }[];
}

export const Dashboard: React.FC = () => {
  const { data: user } = useGetIdentity<any>();

  const { data, isLoading } = useCustom<{ data: DashboardData }>({
    url: "/api/dashboard/stats",
    method: "get",
  });

  const dashboardData = data?.data?.data;
  const userRole = user?.role || "student";

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <Spin size="large" />
      </div>
    );
  }

  const isAdmin = userRole === "admin";
  const isTeacher = userRole === "teacher";

  const statCards = [
    ...(isAdmin
      ? [
          {
            title: "Total Users",
            value: dashboardData?.stats?.totalUsers || 0,
            icon: <UserOutlined />,
            color: "#1890ff",
            bg: "#e6f7ff",
          },
        ]
      : []),
    {
      title: "Total Students",
      value: dashboardData?.stats?.totalStudents || 0,
      icon: <TeamOutlined />,
      color: "#52c41a",
      bg: "#f6ffed",
    },
    {
      title: "Total Courses",
      value: dashboardData?.stats?.totalCourses || 0,
      icon: <BookOutlined />,
      color: "#fa8c16",
      bg: "#fff7e6",
    },
    {
      title: "Total Enrollments",
      value: dashboardData?.stats?.totalEnrollments || 0,
      icon: <FileTextOutlined />,
      color: "#722ed1",
      bg: "#f9f0ff",
    },
  ];

  const enrollmentColumns = [
    {
      title: "Student",
      dataIndex: ["student", "name"],
      key: "student",
      render: (name: string) => name || "N/A",
    },
    {
      title: "Course",
      dataIndex: ["course", "title"],
      key: "course",
      render: (title: string) => title || "N/A",
    },
    {
      title: "Enrolled At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
  ];

  const courseColumns = [
    {
      title: "Course",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Enrollments",
      dataIndex: "enrollmentCount",
      key: "enrollmentCount",
      render: (count: number) => (
        <Tag color="blue">{count} students</Tag>
      ),
    },
  ];

  const roleColors: Record<string, string> = {
    admin: "red",
    teacher: "green",
    student: "blue",
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Welcome back, {user?.name || "User"}!
      </Title>

      <Row gutter={[16, 16]}>
        {statCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={isAdmin ? 6 : 8} key={index}>
            <Card
              style={{
                borderRadius: 8,
                border: `1px solid ${stat.color}20`,
                background: stat.bg,
              }}
            >
              <Statistic
                title={
                  <Text strong style={{ color: stat.color }}>
                    {stat.title}
                  </Text>
                }
                value={stat.value}
                prefix={React.cloneElement(stat.icon as React.ReactElement, {
                  style: { color: stat.color },
                })}
                valueStyle={{ color: stat.color, fontWeight: 600 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {(isAdmin || isTeacher) && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <Card
              title="Recent Enrollments"
              style={{ borderRadius: 8, height: "100%" }}
            >
              <Table
                dataSource={dashboardData?.recentEnrollments || []}
                columns={enrollmentColumns}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{ emptyText: <Empty description="No enrollments yet" /> }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Top Courses by Enrollment"
              style={{ borderRadius: 8, height: "100%" }}
            >
              <Table
                dataSource={dashboardData?.topCourses || []}
                columns={courseColumns}
                rowKey="id"
                pagination={false}
                size="small"
                locale={{ emptyText: <Empty description="No courses yet" /> }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {isAdmin && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card title="User Role Distribution" style={{ borderRadius: 8 }}>
              {dashboardData?.roleDistribution?.length ? (
                <Row gutter={[16, 16]}>
                  {dashboardData.roleDistribution.map((item) => (
                    <Col span={8} key={item.role}>
                      <Statistic
                        title={item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                        value={item.count}
                        valueStyle={{
                          color: roleColors[item.role] || "#1890ff",
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Empty description="No data available" />
              )}
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};
