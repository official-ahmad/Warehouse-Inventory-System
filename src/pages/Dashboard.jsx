import { useEffect, useState } from "react";
import { Package, DollarSign, AlertCircle, TrendingUp } from "lucide-react";
import { getAllProducts } from "../api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Calculate statistics
  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0,
  );
  const lowStockItems = products.filter(
    (p) => p.quantity < p.lowStockThreshold,
  ).length;

  const SummaryCard = ({ icon: Icon, title, value, subtitle, bgColor }) => (
    <div
      className={`${bgColor} rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs opacity-75 mt-2">{subtitle}</p>}
        </div>
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <Icon size={28} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="text-blue-600" size={48} />
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-blue-100 mt-2">
          Welcome back! Here's your inventory overview.
        </p>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            icon={Package}
            title="Total Products"
            value={totalProducts}
            subtitle="Items in warehouse"
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <SummaryCard
            icon={DollarSign}
            title="Total Stock Value"
            value={`$${totalStockValue.toFixed(2)}`}
            subtitle="Inventory valuation"
            bgColor="bg-gradient-to-br from-green-500 to-green-600"
          />
          <SummaryCard
            icon={AlertCircle}
            title="Low Stock Items"
            value={lowStockItems}
            subtitle="Need replenishment"
            bgColor="bg-gradient-to-br from-red-500 to-red-600"
          />
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Quick Statistics
            </h2>
            <TrendingUp className="text-blue-600" size={24} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-600 pl-4 py-2">
              <p className="text-gray-600 text-sm">Average Product Value</p>
              <p className="text-2xl font-bold text-gray-800">
                ${(totalStockValue / (totalProducts || 1)).toFixed(2)}
              </p>
            </div>
            <div className="border-l-4 border-green-600 pl-4 py-2">
              <p className="text-gray-600 text-sm">Total Units in Stock</p>
              <p className="text-2xl font-bold text-gray-800">
                {products.reduce((sum, p) => sum + p.quantity, 0)} units
              </p>
            </div>
            <div className="border-l-4 border-orange-600 pl-4 py-2">
              <p className="text-gray-600 text-sm">Stock Health</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalProducts > 0
                  ? Math.round(
                      ((totalProducts - lowStockItems) / totalProducts) * 100,
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-4 py-2">
              <p className="text-gray-600 text-sm">Categories Covered</p>
              <p className="text-2xl font-bold text-gray-800">
                {new Set(products.map((p) => p.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
