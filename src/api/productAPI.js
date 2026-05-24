import axiosInstance from "./axiosInstance";

// Add a new product
export const addProduct = (productData) => {
  return axiosInstance.post("/products", productData);
};

// Get all products
export const getAllProducts = () => {
  return axiosInstance.get("/products");
};

// Get product by SKU
export const getProductBySKU = (sku) => {
  return axiosInstance.get(`/products/${sku}`);
};

// Update product (optional - add if needed later)
export const updateProduct = (id, productData) => {
  return axiosInstance.put(`/products/${id}`, productData);
};

// Delete product (optional - add if needed later)
export const deleteProduct = (id) => {
  return axiosInstance.delete(`/products/${id}`);
};
