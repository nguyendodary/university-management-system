import React from "react";
import { useMenu, useGetIdentity, useLogout } from "@refinedev/core";
import { Layout as AntdLayout, Menu, Avatar, Dropdown, Typography, theme } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = AntdLayout;
const { Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

const roleMenuConfig: Record<string, string[]> = {
  admin: ["dashboard", "users", "courses", "students", "enrollments"],
  teacher: ["dashboard", "courses", "students", "enrollments"],
  student: ["courses"],
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const { data: user } = useGetIdentity<any>();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userRole = user?.role || "student";
  const allowedMenus = roleMenuConfig[userRole] || ["courses"];

  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardOutlined />,
    users: <UserOutlined />,
    courses: <BookOutlined />,
    students: <TeamOutlined />,
    enrollments: <FileTextOutlined />,
  };

  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    users: "Users",
    courses: "Courses",
    students: "Students",
    enrollments: "Enrollments",
  };

  const routeMap: Record<string, string> = {
    dashboard: "/dashboard",
    users: "/users",
    courses: "/courses",
    students: "/students",
    enrollments: "/enrollments",
  };

  const menuItemsFormatted = allowedMenus.map((key) => ({
    key,
    icon: iconMap[key],
    label: labelMap[key],
    onClick: () => navigate(routeMap[key]),
  }));

  // Determine selected key from current path
  const selectedKey = allowedMenus.find((key) =>
    location.pathname.startsWith(routeMap[key])
  ) || "dashboard";

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => logout(),
    },
  ];

  return (
    <AntdLayout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Text
            strong
            style={{
              color: "#fff",
              fontSize: collapsed ? 16 : 20,
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {collapsed ? "UMS" : "Uni Manager"}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItemsFormatted}
        />
      </Sider>
      <AntdLayout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "all 0.2s",
        }}
      >
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: () => setCollapsed(!collapsed),
            style: { fontSize: 18, cursor: "pointer" },
          })}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
              }}
            >
              <Avatar
                src={user?.avatar}
                icon={!user?.avatar && <UserOutlined />}
                size="small"
              />
              <Text strong>{user?.name || "User"}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({userRole})
              </Text>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </AntdLayout>
    </AntdLayout>
  );
};
