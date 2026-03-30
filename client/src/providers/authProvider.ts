import { AuthBindings } from "@refinedev/core";

const API_URL = "/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }

      return {
        success: false,
        error: {
          message: data.message || "Login failed",
          name: "LoginError",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || "Login failed",
          name: "LoginError",
        },
      };
    }
  },

  register: async ({ name, email, password, role, major }) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, major }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        return {
          success: true,
          redirectTo: "/dashboard",
        };
      }

      return {
        success: false,
        error: {
          message: data.message || "Registration failed",
          name: "RegisterError",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || "Registration failed",
          name: "RegisterError",
        },
      };
    }
  },

  logout: async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // Ignore errors
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");

    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: User = JSON.parse(user);
      return parsed.role;
    }
    return null;
  },

  getIdentity: async () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed: User = JSON.parse(user);
      return {
        id: parsed.id,
        name: parsed.name,
        email: parsed.email,
        role: parsed.role,
        avatar: parsed.avatarUrl,
      };
    }
    return null;
  },

  onError: async (error) => {
    if (error?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return {
        logout: true,
        redirectTo: "/login",
        error: {
          message: "Session expired",
          name: "SessionExpired",
        },
      };
    }
    return { error };
  },
};
