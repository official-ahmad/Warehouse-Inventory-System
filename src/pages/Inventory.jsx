import { useEffect, useState } from "react";
import { AlertCircle, Package, Search } from "lucide-react";
import { getAllProducts } from "../api";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.SKU.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="text-blue-600" size={48} />
          </div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-bold">Inventory</h1>
        <p className="text-blue-100 mt-2">
          Manage and monitor your warehouse products.
        </p>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Status
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const isLowStock =
                      product.quantity < product.lowStockThreshold;
                    return (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {product.SKU}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {product.description}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-lg text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                isLowStock ? "bg-red-500" : "bg-green-500"
                              }`}
                            />
                            <span
                              className={`font-semibold ${
                                isLowStock ? "text-red-600" : "text-green-600"
                              }`}
                            >
                              {product.quantity}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className="font-semibold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {isLowStock ? (
                            <div className="flex items-center justify-center gap-2">
                              <AlertCircle size={16} className="text-red-600" />
                              <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
                                Low Stock
                              </span>
                            </div>
                          ) : (
                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">
                          {searchTerm
                            ? "No products found matching your search."
                            : "No products available."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredProducts.length}</span>{" "}
              of <span className="font-semibold">{products.length}</span>{" "}
              products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
