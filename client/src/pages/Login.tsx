import React from "react";
import { useLogin } from "@refinedev/core";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  App,
  Divider,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const { mutate: login, isLoading } = useLogin();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const onFinish = (values: { email: string; password: string }) => {
    login(values, {
      onSuccess: () => {
        message.success("Login successful!");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        message.error(error?.message || "Login failed. Please try again.");
      },
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Welcome Back
            </Title>
            <Text type="secondary">
              Sign in to University Management Dashboard
            </Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email address"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<LoginOutlined />}
                block
                style={{ height: 48, fontSize: 16 }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary">Don't have an account?</Text>
          </Divider>

          <div style={{ textAlign: "center" }}>
            <Link to="/register">
              <Button type="link" style={{ fontSize: 14 }}>
                Create an account
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
