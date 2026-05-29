import { useState } from "react";
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { createTransaction } from "../api";
import toast from "react-hot-toast";

export default function TransactionModal({
  productId,
  productName,
  currentQuantity,
  onClose,
  onSuccess,
}) {
  const [type, setType] = useState("IN");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qtyNum = parseInt(quantity);

    if (!quantity || qtyNum <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (type === "OUT" && qtyNum > currentQuantity) {
      toast.error(`Shortage! Only ${currentQuantity} units in stock.`);
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        productId,
        type,
        quantity: qtyNum,
      });

      toast.success(
        `${type === "IN" ? "Stock added" : "Stock removed"} successfully!`,
        {
          icon: type === "IN" ? "➕" : "➖",
          style: { borderRadius: "10px", background: "#333", color: "#fff" },
        },
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.error || "Transaction failed";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
        {/* Header Section */}
        <div
          className={`p-6 flex items-center justify-between text-white ${
            type === "IN"
              ? "bg-gradient-to-r from-emerald-600 to-teal-700"
              : "bg-gradient-to-r from-rose-600 to-orange-700"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-xl">
              {type === "IN" ? (
                <TrendingUp size={24} />
              ) : (
                <TrendingDown size={24} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {type === "IN" ? "Stock Receiving" : "Stock Dispatch"}
              </h2>
              <p className="text-xs font-medium opacity-80 uppercase tracking-widest">
                {productName}
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

        <form onSubmit={handleSubmit} className="p-8">
          {/* Status Badge */}
          <div className="mb-8 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Available Inventory
              </p>
              <p className="text-2xl font-black text-slate-800">
                {currentQuantity}{" "}
                <span className="text-sm font-normal text-slate-500">
                  Units
                </span>
              </p>
            </div>
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${type === "IN" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}
            >
              <Package size={20} />
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
              Select Operation
            </label>
            <div className="grid grid-cols-2 gap-4 bg-slate-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setType("IN")}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  type === "IN"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Inbound (Add)
              </button>
              <button
                type="button"
                onClick={() => setType("OUT")}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  type === "OUT"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Outbound (Remove)
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-8">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Quantity to Process
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Calculation Preview */}
          {quantity && (
            <div
              className={`mb-8 p-4 rounded-2xl border flex items-center justify-between ${type === "IN" ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}
            >
              <span className="text-sm font-bold text-slate-600">
                New Balance:
              </span>
              <span
                className={`text-lg font-black ${type === "IN" ? "text-emerald-700" : "text-rose-700"}`}
              >
                {type === "IN"
                  ? currentQuantity + parseInt(quantity || 0)
                  : currentQuantity - parseInt(quantity || 0)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-2xl transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading || !quantity}
              className={`flex-[2] px-6 py-4 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                type === "IN"
                  ? "bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700"
                  : "bg-rose-600 shadow-rose-200 hover:bg-rose-700"
              }`}
            >
              {loading
                ? "Syncing..."
                : `Confirm ${type === "IN" ? "Addition" : "Removal"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
