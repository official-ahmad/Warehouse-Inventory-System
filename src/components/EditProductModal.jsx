import { useState, useEffect } from "react";
import {
  X,
  Edit,
  Info,
  DollarSign,
  Boxes,
  ShieldAlert,
  Calendar,
  Layers,
} from "lucide-react";
import { updateProduct } from "../api";
import toast from "react-hot-toast";

export default function EditProductModal({ product, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    SKU: "",
    category: "",
    price: "",
    costPrice: "",
    lowStockThreshold: "",
    reorderQuantity: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Furniture",
    "Books",
    "Hardware",
    "Other",
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        SKU: product.SKU || "",
        category: product.category || "",
        price: product.price !== undefined ? String(product.price) : "",
        costPrice: product.costPrice !== undefined ? String(product.costPrice) : "",
        lowStockThreshold:
          product.lowStockThreshold !== undefined
            ? String(product.lowStockThreshold)
            : "",
        reorderQuantity:
          product.reorderQuantity !== undefined
            ? String(product.reorderQuantity)
            : "",
        expiryDate: product.expiryDate
          ? new Date(product.expiryDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.SKU ||
      !formData.category ||
      !formData.price ||
      !formData.lowStockThreshold
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    const priceNum = parseFloat(formData.price);
    const costPriceNum = formData.costPrice ? parseFloat(formData.costPrice) : undefined;
    const thresholdNum = parseInt(formData.lowStockThreshold);
    const reorderNum = formData.reorderQuantity ? parseInt(formData.reorderQuantity) : undefined;

    if (priceNum < 0 || (costPriceNum !== undefined && costPriceNum < 0)) {
      toast.error("Prices cannot be negative!");
      return;
    }

    if (thresholdNum < 0 || (reorderNum !== undefined && reorderNum < 0)) {
      toast.error("Quantities cannot be negative!");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        SKU: formData.SKU,
        category: formData.category,
        price: priceNum,
        costPrice: costPriceNum,
        lowStockThreshold: thresholdNum,
        reorderQuantity: reorderNum,
        expiryDate: formData.expiryDate || null,
      };

      await updateProduct(product._id, payload);
      toast.success("Product updated successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to update product";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-8">
        {/* Header Section */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              <Edit size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Edit Product Details</h2>
              <p className="text-xs font-medium opacity-80 uppercase tracking-widest">
                SKU: {product?.SKU}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-black/10 hover:bg-black/20 p-2 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Info size={16} className="text-blue-500" /> Basic Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  SKU / Barcode *
                </label>
                <input
                  type="text"
                  name="SKU"
                  value={formData.SKU}
                  onChange={handleChange}
                  placeholder="e.g. WH-LP-2026"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Expiry Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="2"
                placeholder="Product description..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Finance */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={16} className="text-emerald-500" /> Pricing & Financials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Selling Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Cost Price ($)
                </label>
                <input
                  type="number"
                  name="costPrice"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Thresholds & Alerts */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-500" /> Inventory Thresholds
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Low Stock Threshold *
                </label>
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                  Reorder Quantity
                </label>
                <input
                  type="number"
                  name="reorderQuantity"
                  value={formData.reorderQuantity}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
