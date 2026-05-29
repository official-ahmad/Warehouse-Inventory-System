import axiosInstance from "./axiosInstance";

export const getAllUsers = async () => {
  return axiosInstance.get("/users");
};

export const getUserById = async (id) => {
  return axiosInstance.get(`/users/${id}`);
};

export const createUser = async (
  email,
  password,
  firstName,
  lastName,
  role,
  department,
) => {
  return axiosInstance.post("/users", {
    email,
    password,
    firstName,
    lastName,
    role,
    department,
  });
};

export const updateUser = async (id, updates) => {
  return axiosInstance.put(`/users/${id}`, updates);
};

export const deactivateUser = async (id) => {
  return axiosInstance.delete(`/users/${id}`);
};
