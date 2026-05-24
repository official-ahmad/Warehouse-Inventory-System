import { useState, useCallback } from "react";
import { ArrowLeft, Plus, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.name ||
      !formData.SKU ||
      !formData.category ||
      !formData.quantity ||
      !formData.price
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await addProduct({
        ...formData,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/inventory");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", placeholder, required, step }) => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        step={step}
        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 font-medium hover:border-gray-300 shadow-sm"
      />
    </div>
  );

  const SelectField = ({ label, name, options, required }) => (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 font-medium bg-white hover:border-gray-300 shadow-sm"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white p-8 border-b-4 border-blue-400 shadow-2xl">
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-all duration-300 hover:gap-3"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Inventory</span>
        </button>
        <h1 className="text-4xl font-black">Add New Product</h1>
        <p className="text-blue-100 mt-2 text-lg">
          Create a new product entry in your warehouse
        </p>
      </div>

      
      <div className="p-8">
        
        {success && (
          <div className="mb-6 p-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center gap-4 text-white animate-bounce shadow-2xl">
            <CheckCircle size={28} className="flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Success!</p>
              <p className="text-sm text-green-100">Product added successfully. Redirecting...</p>
            </div>
          </div>
        )}

        
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center gap-4 text-white shadow-2xl animate-pulse">
            <AlertCircle size={28} className="flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Error!</p>
              <p className="text-sm text-red-100">{error}</p>
            </div>
          </div>
        )}

        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-blue-500 transform hover:shadow-3xl transition-all duration-300">
            
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-8 flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Plus size={28} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">Product Details</h2>
                <p className="text-blue-100">Fill in the details below</p>
              </div>
            </div>

            
            <form onSubmit={handleSubmit} className="p-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <InputField
                  label="Product Name"
                  name="name"
                  placeholder="e.g., Laptop Computer"
                  required
                />
                <InputField
                  label="SKU"
                  name="SKU"
                  placeholder="e.g., LAP-001"
                  required
                />
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <SelectField
                  label="Category"
                  name="category"
                  options={categories}
                  required
                />
                <InputField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  placeholder="0"
                  required
                />
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <InputField
                  label="Price per Unit"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  required
                  step="0.01"
                />
                <InputField
                  label="Low Stock Threshold"
                  name="lowStockThreshold"
                  type="number"
                  placeholder="10"
                  required
                />
              </div>

              
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add product description (optional)"
                  rows="5"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-gray-800 font-medium resize-none hover:border-gray-300 shadow-sm"
                />
              </div>

              
              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/inventory")}
                  className="flex-1 px-6 py-4 border-2 border-gray-400 text-gray-800 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-600 transition-all duration-300 text-lg uppercase tracking-wide"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg uppercase tracking-wide shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-6 h-6 border-3 border-white border-t-transparent rounded-full" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={24} />
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
