import axiosInstance from "./axiosInstance";

// Create a new transaction
export const createTransaction = (transactionData) => {
  return axiosInstance.post("/transactions", transactionData);
};

// Get all transactions
export const getAllTransactions = () => {
  return axiosInstance.get("/transactions");
};

// Get transactions by product ID
export const getTransactionsByProductId = (productId) => {
  return axiosInstance.get(`/transactions/${productId}`);
};
