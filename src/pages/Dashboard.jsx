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

  const SummaryCard = ({ icon: Icon, title, value, subtitle, bgColor }) => (
    <div
      className={`${bgColor} rounded-2xl shadow-2xl p-8 text-white transform hover:scale-110 transition-all duration-300 border-t-4 border-white border-opacity-30 hover:shadow-3xl group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold opacity-90 uppercase tracking-wider">{title}</p>
          <p className="text-5xl font-black mt-3 group-hover:text-white transition-colors">{value}</p>
          {subtitle && <p className="text-xs opacity-80 mt-3 font-semibold">{subtitle}</p>}
        </div>
        <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm group-hover:bg-opacity-30 transition-all duration-300">
          <Icon size={36} className="group-hover:scale-125 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-6">
            <Package className="text-blue-400" size={64} />
          </div>
          <p className="text-blue-100 text-lg font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-800 text-white p-8 shadow-2xl border-b-4 border-blue-400">
        <h1 className="text-5xl font-black mb-2">Dashboard</h1>
        <p className="text-blue-100 text-lg">
          Welcome back! Here's your inventory overview.
        </p>
      </div>

      
      <div className="p-8">
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl text-white shadow-2xl border-l-4 border-red-300">
            <p className="font-bold text-lg">{error}</p>
          </div>
        )}

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <SummaryCard
            icon={Package}
            title="Total Products"
            value={totalProducts}
            subtitle="Items in warehouse"
            bgColor="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800"
          />
          <SummaryCard
            icon={DollarSign}
            title="Total Stock Value"
            value={`$${totalStockValue.toFixed(2)}`}
            subtitle="Inventory valuation"
            bgColor="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 hover:from-green-600 hover:via-emerald-700 hover:to-teal-800"
          />
          <SummaryCard
            icon={AlertCircle}
            title="Low Stock Items"
            value={lowStockItems}
            subtitle="Need replenishment"
            bgColor="bg-gradient-to-br from-red-500 via-pink-600 to-rose-700 hover:from-red-600 hover:via-pink-700 hover:to-rose-800"
          />
        </div>

        
        <div className="bg-white bg-opacity-95 rounded-3xl shadow-2xl p-8 border-t-4 border-blue-500 transform hover:shadow-3xl transition-all duration-300 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-gray-800">Quick Statistics</h2>
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
              <TrendingUp className="text-white" size={28} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border-l-4 border-blue-600 pl-6 py-4 bg-gradient-to-br from-blue-50 to-transparent rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
              <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Average Product Value</p>
              <p className="text-4xl font-black text-blue-700 mt-2">
                ${(totalStockValue / (totalProducts || 1)).toFixed(2)}
              </p>
            </div>
            <div className="border-l-4 border-green-600 pl-6 py-4 bg-gradient-to-br from-green-50 to-transparent rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
              <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Total Units in Stock</p>
              <p className="text-4xl font-black text-green-700 mt-2">
                {products.reduce((sum, p) => sum + p.quantity, 0)} units
              </p>
            </div>
            <div className="border-l-4 border-orange-600 pl-6 py-4 bg-gradient-to-br from-orange-50 to-transparent rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
              <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Stock Health</p>
              <p className="text-4xl font-black text-orange-700 mt-2">
                {totalProducts > 0
                  ? Math.round(
                      ((totalProducts - lowStockItems) / totalProducts) * 100
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="border-l-4 border-purple-600 pl-6 py-4 bg-gradient-to-br from-purple-50 to-transparent rounded-xl p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:translate-x-2">
              <p className="text-gray-600 text-sm font-bold uppercase tracking-wide">Categories Covered</p>
              <p className="text-4xl font-black text-purple-700 mt-2">
                {new Set(products.map((p) => p.category)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
