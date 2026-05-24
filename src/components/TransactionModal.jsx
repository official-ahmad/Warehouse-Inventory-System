import { useState } from "react";
import {
  X,
  ArrowUpRight,
  ArrowDownLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { createTransaction } from "../api";

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
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!quantity || parseInt(quantity) <= 0) {
      setError("Please enter a valid quantity");
      return;
    }

    if (type === "OUT" && parseInt(quantity) > currentQuantity) {
      setError(
        `Cannot remove ${quantity} units. Only ${currentQuantity} units available.`,
      );
      return;
    }

    try {
      setLoading(true);
      await createTransaction({
        productId,
        type,
        quantity: parseInt(quantity),
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create transaction");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in">
        
        <div
          className={`bg-gradient-to-r ${
            type === "IN"
              ? "from-green-600 to-green-700"
              : "from-blue-600 to-blue-700"
          } text-white p-6 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            {type === "IN" ? (
              <ArrowDownLeft size={28} />
            ) : (
              <ArrowUpRight size={28} />
            )}
            <div>
              <h2 className="text-xl font-bold">
                {type === "IN" ? "Stock In" : "Stock Out"}
              </h2>
              <p className="text-sm opacity-90">{productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        
        {success && (
          <div className="p-6 border-b border-gray-200 bg-green-50">
            <div className="flex items-center gap-3 text-green-700">
              <CheckCircle size={24} />
              <div>
                <p className="font-semibold">Success!</p>
                <p className="text-sm">Transaction recorded successfully</p>
              </div>
            </div>
          </div>
        )}

        
        {error && (
          <div className="p-6 border-b border-gray-200 bg-red-50">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle size={24} />
              <div>
                <p className="font-semibold">Error!</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        
        {!success && (
          <form onSubmit={handleSubmit} className="p-6">
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Current Stock Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {currentQuantity} units
              </p>
            </div>

            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["IN", "OUT"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      type === t
                        ? t === "IN"
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {t === "IN" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                    {t === "IN" ? "Stock In" : "Stock Out"}
                  </button>
                ))}
              </div>
            </div>

            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                min="1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
              />
            </div>

            
            {quantity && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Preview</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    {type === "IN"
                      ? "Stock will be added:"
                      : "Stock will be removed:"}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      type === "IN" ? "text-green-600" : "text-blue-600"
                    }`}
                  >
                    {type === "IN" ? "+" : "-"}
                    {quantity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {type === "IN"
                    ? `New stock: ${currentQuantity + parseInt(quantity || 0)}`
                    : `New stock: ${currentQuantity - parseInt(quantity || 0)}`}
                </p>
              </div>
            )}

            
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !quantity}
                className={`flex-1 px-4 py-3 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  type === "IN"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    {type === "IN" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                    {type === "IN" ? "Add Stock" : "Remove Stock"}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
