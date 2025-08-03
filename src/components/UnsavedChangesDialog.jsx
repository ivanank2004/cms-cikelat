"use client";

import { AlertTriangle } from "lucide-react";

export default function UnsavedChangesDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Perubahan Belum Disimpan",
    message = "Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?",
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                <div className="flex items-start gap-4">
                    <div className="text-amber-500 shrink-0">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">{message}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                    >
                        Ya, Tinggalkan
                    </button>
                </div>
            </div>
        </div>
    );
}
