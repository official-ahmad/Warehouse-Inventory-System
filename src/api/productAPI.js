import axiosInstance from "./axiosInstance";


export const addProduct = (productData) => {
  return axiosInstance.post("/products", productData);
};


export const getAllProducts = () => {
  return axiosInstance.get("/products");
};


export const getProductBySKU = (sku) => {
  return axiosInstance.get(`/products/${sku}`);
};


export const updateProduct = (id, productData) => {
  return axiosInstance.put(`/products/${id}`, productData);
};


export const deleteProduct = (id) => {
  return axiosInstance.delete(`/products/${id}`);
};
