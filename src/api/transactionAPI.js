import axiosInstance from "./axiosInstance";


export const createTransaction = (transactionData) => {
  return axiosInstance.post("/transactions", transactionData);
};


export const getAllTransactions = () => {
  return axiosInstance.get("/transactions");
};


export const getTransactionsByProductId = (productId) => {
  return axiosInstance.get(`/transactions/${productId}`);
};
