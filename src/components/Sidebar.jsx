import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ArrowRightLeft,
  Plus,
} from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Inventory",
      path: "/inventory",
      icon: Package,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: ArrowRightLeft,
    },
    {
      name: "Add Product",
      path: "/add-product",
      icon: Plus,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-700 via-blue-800 to-slate-900 text-white shadow-2xl transition-transform duration-300 z-40 flex flex-col overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        
        <div className="p-6 border-b-2 border-blue-600 bg-gradient-to-r from-blue-700 to-blue-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
              <Package className="text-blue-600" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                WarehouseHub
              </h1>
              <p className="text-xs text-blue-300 font-semibold">Management System</p>
            </div>
          </div>
        </div>

        
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-800">
          <p className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-6 px-2">
            ✨ Navigation
          </p>
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-semibold transform hover:scale-105 ${
                    active
                      ? "bg-gradient-to-r from-white to-blue-50 text-blue-700 shadow-lg border-l-4 border-blue-600"
                      : "text-blue-100 hover:bg-blue-600 hover:text-white hover:shadow-lg"
                  }`}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {active && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />}
                </Link>
              );
            })}
          </div>
        </nav>

        
        <div className="p-4 border-t-2 border-blue-600 bg-blue-900 flex-shrink-0">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-sm shadow-lg transform hover:scale-105 transition-all duration-300">
            <p className="font-bold mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Connected
            </p>
            <p className="text-xs text-green-50">API: localhost:8000</p>
            <p className="text-xs text-green-50">Status: Online</p>
          </div>
        </div>
      </aside>

      
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 lg:hidden z-30 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
