import { Refine } from "@refinedev/core";
import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider } from "./providers/authProvider";
import { customDataProvider } from "./providers/dataProvider";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { UserList, UserShow } from "./pages/Users";
import { CourseList, CourseCreate, CourseEdit, CourseShow } from "./pages/Courses";
import { StudentList, StudentCreate, StudentEdit, StudentShow } from "./pages/Students";
import { EnrollmentList, EnrollmentCreate } from "./pages/Enrollments";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ConfigProvider theme={RefineThemes.Blue}>
          <AntdApp>
            <Refine
              dataProvider={customDataProvider}
              authProvider={authProvider}
              routerProvider={routerBindings}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/dashboard",
                  meta: { label: "Dashboard" },
                },
                {
                  name: "users",
                  list: "/users",
                  show: "/users/show/:id",
                  meta: { label: "Users" },
                },
                {
                  name: "courses",
                  list: "/courses",
                  create: "/courses/create",
                  edit: "/courses/edit/:id",
                  show: "/courses/show/:id",
                  meta: { label: "Courses" },
                },
                {
                  name: "students",
                  list: "/students",
                  create: "/students/create",
                  edit: "/students/edit/:id",
                  show: "/students/show/:id",
                  meta: { label: "Students" },
                },
                {
                  name: "enrollments",
                  list: "/enrollments",
                  create: "/enrollments/create",
                  meta: { label: "Enrollments" },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<UserList />} />
                  <Route path="/users/show/:id" element={<UserShow />} />
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/courses/create" element={<CourseCreate />} />
                  <Route path="/courses/edit/:id" element={<CourseEdit />} />
                  <Route path="/courses/show/:id" element={<CourseShow />} />
                  <Route path="/students" element={<StudentList />} />
                  <Route path="/students/create" element={<StudentCreate />} />
                  <Route path="/students/edit/:id" element={<StudentEdit />} />
                  <Route path="/students/show/:id" element={<StudentShow />} />
                  <Route path="/enrollments" element={<EnrollmentList />} />
                  <Route path="/enrollments/create" element={<EnrollmentCreate />} />
                </Route>
              </Routes>
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ConfigProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
