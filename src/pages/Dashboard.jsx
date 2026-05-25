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

  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (sum, product) => sum + product.quantity * product.price,
    0
  );
  const lowStockItems = products.filter(
    (p) => p.quantity < p.lowStockThreshold
  ).length;

  const StatCard = ({ icon: Icon, title, value, subtext, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
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
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">
          Overview of your warehouse inventory
        </p>
      </div>

      <div className="p-4 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Package}
            title="Total Products"
            value={totalProducts}
            subtext="Items in warehouse"
            color="bg-blue-600"
          />
          <StatCard
            icon={DollarSign}
            title="Stock Value"
            value={`$${totalStockValue.toFixed(2)}`}
            subtext="Total inventory value"
            color="bg-green-600"
          />
          <StatCard
            icon={AlertCircle}
            title="Low Stock"
            value={lowStockItems}
            subtext="Items need replenishment"
            color="bg-red-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Average Value</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${(totalStockValue / (totalProducts || 1)).toFixed(2)}
            </p>
            <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-blue-600"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Total Units</p>
            <p className="text-2xl font-semibold text-gray-900">
              {products.reduce((sum, p) => sum + p.quantity, 0)}
            </p>
            <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-green-600"></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Stock Health</p>
            <p className="text-2xl font-semibold text-gray-900">
              {totalProducts > 0
                ? Math.round(
                    ((totalProducts - lowStockItems) / totalProducts) * 100
                  )
                : 0}
              %
            </p>
            <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600"
                style={{
                  width: `${
                    totalProducts > 0
                      ? ((totalProducts - lowStockItems) / totalProducts) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-2">Categories</p>
            <p className="text-2xl font-semibold text-gray-900">
              {new Set(products.map((p) => p.category)).size}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <TrendingUp size={16} className="text-purple-600" />
              <span className="text-xs text-gray-600">Active categories</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
