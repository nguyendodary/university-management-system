import React from "react";
import { useRegister } from "@refinedev/core";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  App,
  Divider,
  Select,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";

const { Title, Text } = Typography;

export const Register: React.FC = () => {
  const { mutate: register, isLoading } = useRegister();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const role = Form.useWatch("role", form);

  const onFinish = (values: any) => {
    register(values, {
      onSuccess: () => {
        message.success("Registration successful!");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        message.error(
          error?.message || "Registration failed. Please try again."
        );
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
      <div style={{ width: "100%", maxWidth: 480 }}>
        <Card
          style={{
            borderRadius: 12,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Create Account
            </Title>
            <Text type="secondary">
              Join University Management Dashboard
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            initialValues={{ role: "student" }}
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please enter your name" },
                { min: 2, message: "Name must be at least 2 characters" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full name"
                autoComplete="name"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email address"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 8, message: "Password must be at least 8 characters" },
                {
                  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain uppercase, lowercase, and number",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item name="role" label="Role">
              <Select>
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="teacher">Teacher</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
              </Select>
            </Form.Item>

            {role === "student" && (
              <Form.Item
                name="major"
                label="Major"
                rules={[
                  { required: role === "student", message: "Major is required for students" },
                ]}
              >
                <Input placeholder="e.g., Computer Science" />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                icon={<UserAddOutlined />}
                block
                style={{ height: 48, fontSize: 16 }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary">Already have an account?</Text>
          </Divider>

          <div style={{ textAlign: "center" }}>
            <Link to="/login">
              <Button type="link" style={{ fontSize: 14 }}>
                Sign in instead
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
