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
      <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
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
    <div className="lg:ml-64 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-4xl font-bold">Transactions History</h1>
        <p className="text-blue-100 mt-2">
          Track all stock in and out movements.
        </p>
      </div>

      
      <div className="p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        
        <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-4">
            <Filter size={20} className="text-gray-600" />
            <div className="flex gap-2 flex-wrap">
              {["ALL", "IN", "OUT"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    filterType === type
                      ? type === "IN"
                        ? "bg-green-600 text-white"
                        : type === "OUT"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type === "ALL" ? "All Transactions" : `Stock ${type}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Type
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Date
                  </th>
                </tr>
              </thead>

              
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => {
                    const isIn = transaction.type === "IN";
                    return (
                      <tr
                        key={transaction._id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package size={20} className="text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.productId?.name ||
                                  "Unknown Product"}
                              </p>
                              <p className="text-xs text-gray-500">
                                SKU: {transaction.productId?.SKU || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            {isIn ? (
                              <>
                                <ArrowDownLeft
                                  size={18}
                                  className="text-green-600"
                                />
                                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                  Stock In
                                </span>
                              </>
                            ) : (
                              <>
                                <ArrowUpRight
                                  size={18}
                                  className="text-blue-600"
                                />
                                <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                  Stock Out
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`text-lg font-bold ${
                              isIn ? "text-green-600" : "text-blue-600"
                            }`}
                          >
                            {isIn ? "+" : "-"}
                            {transaction.quantity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={16} />
                            <span className="text-sm">
                              {formatDate(transaction.date)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Package size={48} className="text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">
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

          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {filteredTransactions.length}
              </span>{" "}
              of <span className="font-semibold">{transactions.length}</span>{" "}
              transactions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
