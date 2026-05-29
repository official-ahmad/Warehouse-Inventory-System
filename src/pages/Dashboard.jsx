import { useEffect, useState } from "react";
import {
  Package,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Boxes,
  Activity,
  Wallet,
} from "lucide-react";
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
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Calculations
  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0,
  );
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStockItems = products.filter(
    (p) => p.quantity < p.lowStockThreshold,
  ).length;
  const categoriesCount = new Set(products.map((p) => p.category)).size;
  const stockHealth =
    totalProducts > 0
      ? Math.round(((totalProducts - lowStockItems) / totalProducts) * 100)
      : 0;

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <Package
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600"
              size={24}
            />
          </div>
          <p className="mt-4 font-bold text-slate-500 tracking-widest animate-pulse uppercase text-xs">
            Synchronizing Inventory...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-[#f8fafc] pb-10">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-8 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Intelligence Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium flex items-center gap-2">
              <Activity size={14} className="text-blue-500" /> Real-time
              Warehouse Analytics
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-blue-700 uppercase">
              System Live
            </span>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-10 max-w-7xl mx-auto">
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-r-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Top Tier Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={Package}
            title="Active SKU Count"
            value={totalProducts}
            subtext="Total unique products"
            color="bg-blue-600"
            trend={`${categoriesCount} Categories`}
          />
          <StatCard
            icon={Wallet}
            title="Inventory Valuation"
            value={`$${totalStockValue.toLocaleString()}`}
            subtext="Market value of stock"
            color="bg-emerald-600"
            trend="Current Asset"
          />
          <StatCard
            icon={AlertCircle}
            title="Critical Stock Alerts"
            value={lowStockItems}
            subtext="Items below threshold"
            color={lowStockItems > 0 ? "bg-rose-600" : "bg-slate-400"}
            trend={lowStockItems > 0 ? "Action Required" : "All Good"}
          />
        </div>

        {/* Bottom Tier Analytics */}
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          Efficiency Metrics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MiniMetric
            label="Avg Unit Price"
            value={`$${(totalStockValue / (totalProducts || 1)).toFixed(1)}`}
            progress={60}
            color="blue"
          />
          <MiniMetric
            label="Total On-Hand Units"
            value={totalUnits.toLocaleString()}
            progress={85}
            color="emerald"
          />
          <MiniMetric
            label="Inventory Health"
            value={`${stockHealth}%`}
            progress={stockHealth}
            color={stockHealth > 80 ? "emerald" : "orange"}
          />
          <MiniMetric
            label="Global Categories"
            value={categoriesCount}
            progress={100}
            color="purple"
            icon={<TrendingUp size={14} />}
          />
        </div>
      </main>
    </div>
  );
}

// Sub-Components for Alignment & Reusability
function StatCard({ icon: Icon, title, value, subtext, color, trend }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-2xl ${color} text-white shadow-lg shadow-inherit/20`}
        >
          <Icon size={24} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500 px-2 py-1 rounded-md">
          {trend}
        </span>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
          {title}
        </p>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {value}
        </h2>
        <p className="text-slate-400 text-[11px] mt-2 font-medium italic">
          {subtext}
        </p>
      </div>
    </div>
  );
}

function MiniMetric({ label, value, progress, color, icon }) {
  const colors = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
      <div className="flex justify-between items-center mb-3">
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">
          {label}
        </p>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>
      <p className="text-xl font-black text-slate-800 mb-4">{value}</p>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]} transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
