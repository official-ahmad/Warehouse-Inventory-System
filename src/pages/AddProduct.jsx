import { useState, useRef } from "react";
import { ArrowLeft, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api";
import { useToast } from "../context/ToastContext";

export default function AddProduct() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const formRef = useRef({
    name: "",
    description: "",
    SKU: "",
    category: "",
    quantity: "",
    price: "",
    lowStockThreshold: "10",
  });

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Furniture",
    "Books",
    "Hardware",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    formRef.current[name] = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const data = formRef.current;
    if (!data.name || !data.SKU || !data.category || !data.quantity || !data.price) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await addProduct({
        ...data,
        quantity: parseInt(data.quantity),
        price: parseFloat(data.price),
        lowStockThreshold: parseInt(data.lowStockThreshold),
      });

      setSuccess(true);
      addToast("Product added successfully!", "success", 2000);
      setTimeout(() => {
        navigate("/inventory");
      }, 1500);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to add product";
      setError(errMsg);
      addToast(errMsg, "error", 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 p-4 md:p-8">
        <button
          onClick={() => navigate("/inventory")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors mb-4"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Add Product</h1>
          <p className="text-gray-600 text-sm mt-1">Create a new product entry</p>
        </div>
      </div>

      <div className="p-4 md:p-8">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="font-medium text-green-900">Success!</p>
              <p className="text-sm text-green-700">Product added. Redirecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600" />
            <div>
              <p className="font-medium text-red-900">Error!</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="max-w-2xl">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    placeholder="e.g., Laptop Computer"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="SKU"
                    onChange={handleChange}
                    placeholder="e.g., LAP-001"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Low Stock Threshold <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="lowStockThreshold"
                    onChange={handleChange}
                    placeholder="10"
                    defaultValue="10"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  placeholder="Add product description (optional)"
                  rows="4"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/inventory")}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
