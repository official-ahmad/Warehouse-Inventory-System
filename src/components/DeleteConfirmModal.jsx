import { X, Trash2, AlertCircle } from "lucide-react";

export default function DeleteConfirmModal({
  productName,
  onConfirm,
  onCancel,
  loading,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full transform transition-all animate-in">
        <div className="bg-red-50 border-b border-red-200 p-6 flex items-start gap-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <AlertCircle size={24} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Delete Product?
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              This action cannot be undone.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="ml-auto hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">"{productName}"</span>
            ? This product and all its transaction history will be permanently
            removed.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={18} />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
