import axiosInstance from "./axiosInstance";

export const getActivityLogs = async (params = {}) => {
  return axiosInstance.get("/activity-logs", { params });
};

export const getUserActivityLogs = async (userId, params = {}) => {
  return axiosInstance.get(`/activity-logs/user/${userId}`, { params });
};

export const exportActivityLogs = async () => {
  return axiosInstance.get("/activity-logs/export");
};
