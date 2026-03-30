import React from "react";
import { Button, Typography, Row, Col, Card, Space } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

const features = [
  {
    icon: <TeamOutlined style={{ fontSize: 36, color: "#1890ff" }} />,
    title: "Student Management",
    description:
      "Manage student profiles, track majors, and organize academic records efficiently.",
  },
  {
    icon: <BookOutlined style={{ fontSize: 36, color: "#52c41a" }} />,
    title: "Course Catalog",
    description:
      "Create and manage courses with detailed descriptions and enrollment tracking.",
  },
  {
    icon: <FileTextOutlined style={{ fontSize: 36, color: "#fa8c16" }} />,
    title: "Enrollment System",
    description:
      "Seamlessly enroll students in courses and monitor academic progress.",
  },
  {
    icon: <SafetyOutlined style={{ fontSize: 36, color: "#722ed1" }} />,
    title: "Role-Based Access",
    description:
      "Secure access control for admins, teachers, and students with JWT authentication.",
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Navbar */}
      <div
        style={{
          padding: "16px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          background: "#fff",
          zIndex: 100,
        }}
      >
        <Text strong style={{ fontSize: 20, color: "#1890ff" }}>
          University Manager
        </Text>
        <Space>
          <Button type="text" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button type="primary" onClick={() => navigate("/register")}>
            Get Started
          </Button>
        </Space>
      </div>

      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "100px 48px",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <Title
          level={1}
          style={{ color: "#fff", fontSize: 52, marginBottom: 16, fontWeight: 700 }}
        >
          University Management Dashboard
        </Title>
        <Paragraph
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 20,
            maxWidth: 640,
            margin: "0 auto 40px",
            lineHeight: 1.6,
          }}
        >
          A modern, full-stack platform to manage students, courses, and
          enrollments with powerful analytics and role-based access control.
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/register")}
            style={{
              height: 52,
              fontSize: 16,
              borderRadius: 8,
              background: "#fff",
              color: "#667eea",
              border: "none",
              fontWeight: 600,
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            Create Account
          </Button>
          <Button
            size="large"
            onClick={() => navigate("/login")}
            ghost
            style={{
              height: 52,
              fontSize: 16,
              borderRadius: 8,
              color: "#fff",
              borderColor: "rgba(255,255,255,0.6)",
              paddingLeft: 32,
              paddingRight: 32,
            }}
          >
            Sign In
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <div style={{ padding: "80px 48px", maxWidth: 1200, margin: "0 auto" }}>
        <Title level={2} style={{ textAlign: "center", marginBottom: 12 }}>
          Everything You Need
        </Title>
        <Paragraph
          type="secondary"
          style={{ textAlign: "center", fontSize: 16, marginBottom: 48 }}
        >
          Powerful features to streamline university administration
        </Paragraph>

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  height: "100%",
                  textAlign: "center",
                  border: "1px solid #f0f0f0",
                }}
                styles={{ body: { padding: 32 } }}
              >
                <div style={{ marginBottom: 16 }}>{feature.icon}</div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {feature.title}
                </Title>
                <Text type="secondary">{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Stats Section */}
      <div
        style={{
          background: "#fafafa",
          padding: "64px 48px",
        }}
      >
        <Row gutter={[48, 48]} justify="center">
          {[
            { value: "4", label: "Core Modules" },
            { value: "3", label: "User Roles" },
            { value: "100%", label: "TypeScript" },
            { value: "PERN", label: "Stack" },
          ].map((stat, index) => (
            <Col key={index} style={{ textAlign: "center" }}>
              <Title level={2} style={{ color: "#667eea", marginBottom: 4 }}>
                {stat.value}
              </Title>
              <Text type="secondary">{stat.label}</Text>
            </Col>
          ))}
        </Row>
      </div>

      {/* CTA Section */}
      <div style={{ padding: "80px 48px", textAlign: "center" }}>
        <Title level={2}>Ready to Get Started?</Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 32 }}>
          Join now and start managing your university efficiently.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/register")}
          icon={<ArrowRightOutlined />}
          style={{
            height: 52,
            fontSize: 16,
            borderRadius: 8,
            paddingLeft: 32,
            paddingRight: 32,
          }}
        >
          Create Free Account
        </Button>
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "24px 48px",
          textAlign: "center",
        }}
      >
        <Text type="secondary">
          University Management Dashboard &copy; {new Date().getFullYear()} |
          Built with PERN Stack
        </Text>
      </div>
    </div>
  );
};
