"use client";

import { Loader2, AlertTriangle } from "lucide-react";

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Hapus",
    cancelText = "Batal",
    isLoading = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
                <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{message}</p>
                </div>
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition text-sm text-gray-600 font-medium disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading && (
                            <Loader2 size={16} className="animate-spin" />
                        )}
                        {isLoading ? "Memproses..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
