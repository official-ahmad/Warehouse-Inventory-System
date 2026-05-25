import { useEffect, useState } from "react";
import { AlertCircle, Package, Search, Edit2, Trash2 } from "lucide-react";
import { getAllProducts, deleteProduct } from "../api";
import { useToast } from "../context/ToastContext";
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
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getAllProducts();
        setProducts(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleTransactionSuccess = () => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirm) return;

    try {
      setDeleting(true);
      await deleteProduct(deleteConfirm.id);
      setProducts(products.filter((p) => p._id !== deleteConfirm.id));
      addToast(
        `"${deleteConfirm.name}" deleted successfully!`,
        "success",
        2000
      );
      setDeleteConfirm(null);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Failed to delete product";
      addToast(errMsg, "error", 3000);
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.SKU.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="text-blue-600 mx-auto" size={48} />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Inventory</h1>
        <p className="text-gray-600 text-sm mt-1">Manage your warehouse products</p>
      </div>

      <div className="p-4 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">SKU</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">Product</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">Category</th>
                  <th className="px-3 md:px-6 py-3 text-center text-xs md:text-sm font-medium text-gray-700">Qty</th>
                  <th className="px-3 md:px-6 py-3 text-right text-xs md:text-sm font-medium text-gray-700">Price</th>
                  <th className="px-3 md:px-6 py-3 text-center text-xs md:text-sm font-medium text-gray-700">Status</th>
                  <th className="px-3 md:px-6 py-3 text-center text-xs md:text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isLowStock = product.quantity < product.lowStockThreshold;
                    return (
                      <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 md:px-6 py-4">
                          <span className="inline-block bg-blue-50 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            {product.SKU}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{product.description}</p>
                        </td>
                        <td className="px-3 md:px-6 py-4">
                          <span className="text-xs md:text-sm text-gray-600">{product.category}</span>
                        </td>
                        <td className="px-3 md:px-6 py-4 text-center">
                          <span className={`font-medium text-sm ${isLowStock ? "text-red-600" : "text-green-600"}`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-4 text-right">
                          <span className="font-medium text-gray-900 text-sm">
                            ${product.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-3 md:px-6 py-4 text-center">
                          {isLowStock ? (
                            <span className="inline-block bg-red-50 text-red-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                              Low
                            </span>
                          ) : (
                            <span className="inline-block bg-green-50 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                              Good
                            </span>
                          )}
                        </td>
                        <td className="px-3 md:px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() =>
                                setSelectedProduct({
                                  id: product._id,
                                  name: product.name,
                                  quantity: product.quantity,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2 md:px-3 py-1.5 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-xs md:text-sm"
                            >
                              <Edit2 size={14} />
                              <span className="hidden md:inline">Update</span>
                              <span className="md:hidden">Edit</span>
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  id: product._id,
                                  name: product.name,
                                })
                              }
                              className="inline-flex items-center gap-1 px-2 md:px-3 py-1.5 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors text-xs md:text-sm"
                            >
                              <Trash2 size={14} />
                              <span className="hidden md:inline">Delete</span>
                              <span className="md:hidden">Del</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-3 md:px-6 py-12 text-center">
                      <Package size={40} className="text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No products found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-3 md:px-6 py-3 border-t border-gray-100">
            <p className="text-xs md:text-sm text-gray-600">
              <span className="font-medium">{filteredProducts.length}</span> of{" "}
              <span className="font-medium">{products.length}</span> products
            </p>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <TransactionModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          currentQuantity={selectedProduct.quantity}
          onClose={() => setSelectedProduct(null)}
          onSuccess={handleTransactionSuccess}
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
