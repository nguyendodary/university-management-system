import dataProvider from "@refinedev/simple-rest";
import axios from "axios";

const API_URL = "/api";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

const baseDataProvider = dataProvider(API_URL, axiosInstance);

export const customDataProvider = {
  ...baseDataProvider,
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const response = await baseDataProvider.getList({
      resource,
      pagination,
      filters,
      sorters,
      meta,
    });

    // Transform: our API returns { success, data: [...], meta: { total } }
    // Refine expects { data: [...], total: number }
    const rawData = response.data as any;

    if (rawData && typeof rawData === "object" && "data" in rawData) {
      return {
        data: Array.isArray(rawData.data) ? rawData.data : [],
        total: rawData.meta?.total || rawData.data?.length || 0,
      };
    }

    return response;
  },
  getOne: async ({ resource, id, meta }) => {
    const response = await baseDataProvider.getOne({
      resource,
      id,
      meta,
    });

    const rawData = response.data as any;

    if (rawData && typeof rawData === "object" && "data" in rawData) {
      return { data: rawData.data };
    }

    return response;
  },
  create: async ({ resource, variables, meta }) => {
    const response = await baseDataProvider.create({
      resource,
      variables,
      meta,
    });

    const rawData = response.data as any;

    if (rawData && typeof rawData === "object" && "data" in rawData) {
      return { data: rawData.data };
    }

    return response;
  },
  update: async ({ resource, id, variables, meta }) => {
    const response = await baseDataProvider.update({
      resource,
      id,
      variables,
      meta,
    });

    const rawData = response.data as any;

    if (rawData && typeof rawData === "object" && "data" in rawData) {
      return { data: rawData.data };
    }

    return response;
  },
  deleteOne: async ({ resource, id, variables, meta }) => {
    const response = await baseDataProvider.deleteOne({
      resource,
      id,
      variables,
      meta,
    });

    const rawData = response.data as any;

    if (rawData && typeof rawData === "object" && "data" in rawData) {
      return { data: rawData.data };
    }

    return response;
  },
  custom: async ({ url, method, payload, query, headers }) => {
    let axiosResponse;
    switch (method) {
      case "put":
        axiosResponse = await axiosInstance.put(url, payload, { headers, params: query });
        break;
      case "post":
        axiosResponse = await axiosInstance.post(url, payload, { headers, params: query });
        break;
      case "delete":
        axiosResponse = await axiosInstance.delete(url, { data: payload, headers, params: query });
        break;
      default:
        axiosResponse = await axiosInstance.get(url, { headers, params: query });
        break;
    }

    return { data: axiosResponse.data };
  },
};
