import { useEffect, useState } from "react";
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Filter,
} from "lucide-react";
import { getAllTransactions } from "../api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("ALL");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await getAllTransactions();
        setTransactions(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch transactions");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions =
    filterType === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filterType);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="lg:ml-64 min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Package className="text-blue-600" size={48} />
          </div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:ml-64 min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Transactions History</h1>
        <p className="text-gray-600 text-sm mt-1">
          Track all stock in and out movements.
        </p>
      </div>

      <div className="p-4 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <Filter size={20} className="text-gray-600" />
            <div className="flex gap-2 flex-wrap">
              {["ALL", "IN", "OUT"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm md:text-base ${
                    filterType === type
                      ? type === "IN"
                        ? "bg-green-600 text-white"
                        : type === "OUT"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type === "ALL" ? "All" : `${type}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">
                    Product Name
                  </th>
                  <th className="px-4 md:px-6 py-3 text-center text-xs md:text-sm font-medium text-gray-700">
                    Type
                  </th>
                  <th className="px-4 md:px-6 py-3 text-center text-xs md:text-sm font-medium text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-medium text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => {
                    const isIn = transaction.type === "IN";
                    return (
                      <tr
                        key={transaction._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 md:px-6 py-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 md:w-10 h-8 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package size={16} className="text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate text-sm">
                                {transaction.productId?.name ||
                                  "Unknown Product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {transaction.productId?.SKU || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1 md:gap-2">
                            {isIn ? (
                              <>
                                <ArrowDownLeft
                                  size={16}
                                  className="text-green-600 hidden md:inline"
                                />
                                <span className="inline-block bg-green-50 text-green-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                                  In
                                </span>
                              </>
                            ) : (
                              <>
                                <ArrowUpRight
                                  size={16}
                                  className="text-blue-600 hidden md:inline"
                                />
                                <span className="inline-block bg-blue-50 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                                  Out
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`text-base md:text-lg font-bold ${
                              isIn ? "text-green-600" : "text-blue-600"
                            }`}
                          >
                            {isIn ? "+" : "-"}
                            {transaction.quantity}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 md:gap-2 text-gray-600">
                            <Calendar size={14} className="hidden md:inline" />
                            <span className="text-xs md:text-sm">
                              {formatDate(transaction.date)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 md:px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package size={40} className="text-gray-300 mb-3" />
                        <p className="text-gray-500 text-sm md:text-base">
                          {filterType === "ALL"
                            ? "No transactions found."
                            : `No ${filterType} transactions found.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-4 md:px-6 py-3 border-t border-gray-100">
            <p className="text-xs md:text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {filteredTransactions.length}
              </span>{" "}
              of <span className="font-medium">{transactions.length}</span>{" "}
              transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
