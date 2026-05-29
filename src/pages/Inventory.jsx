import { useEffect, useState } from "react";
import {
  AlertCircle,
  Package,
  Search,
  Edit2,
  Trash2,
  Filter,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";
import { getAllProducts, deleteProduct } from "../api";
import toast from "react-hot-toast";
import TransactionModal from "../components/TransactionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async () => {
    if (!deleteConfirm) return;
    try {
      setDeleting(true);
      await deleteProduct(deleteConfirm.id);
      setProducts(products.filter((p) => p._id !== deleteConfirm.id));
      toast.success("Product removed from inventory");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Deletion failed");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.SKU.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Package size={40} className="text-slate-300 mb-2" />
          <div className="h-2 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-[#f8fafc]">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Inventory Stock
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Monitoring {products.length} unique items
            </p>
          </div>

          {/* Search Bar - Integrated Design */}
          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Quick search by SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Identification
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Product Details
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Category
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Stock Level
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                    Unit Price
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const isLow = product.quantity < product.lowStockThreshold;
                  return (
                    <tr
                      key={product._id}
                      className="group hover:bg-slate-50/80 transition-all duration-200"
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                          {product.SKU}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-slate-400 truncate max-w-[180px]">
                            {product.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`text-sm font-black ${isLow ? "text-rose-600" : "text-emerald-600"}`}
                          >
                            {product.quantity.toLocaleString()}
                          </span>
                          <div
                            className={`h-1 w-8 rounded-full ${isLow ? "bg-rose-200" : "bg-emerald-200"}`}
                          >
                            <div
                              className={`h-full rounded-full ${isLow ? "bg-rose-500" : "bg-emerald-500"}`}
                              style={{ width: isLow ? "30%" : "100%" }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className="font-bold text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              setSelectedProduct({
                                id: product._id,
                                name: product.name,
                                quantity: product.quantity,
                              })
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="Update Stock"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                id: product._id,
                                name: product.name,
                              })
                            }
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination/Info */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Showing {filteredProducts.length} Results
            </span>
            <div className="flex gap-2">
              <button
                className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-50"
                disabled
              >
                <ChevronRight className="rotate-180" size={16} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <TransactionModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          currentQuantity={selectedProduct.quantity}
          onClose={() => setSelectedProduct(null)}
          onSuccess={fetchProducts}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          productName={deleteConfirm.name}
          onConfirm={handleDeleteProduct}
          onCancel={() => setDeleteConfirm(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
