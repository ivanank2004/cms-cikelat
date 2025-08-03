"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function EditVisiMisiModal({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSubmit,
    isSubmitting = false,
}) {
    if (!isOpen) return null;

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mx-4">
                <h3 className="text-xl font-bold mb-6 text-gray-800">
                    Edit Visi & Misi
                </h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="space-y-6"
                >
                    <div>
                        <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="visi"
                        >
                            Visi
                        </label>
                        <textarea
                            id="visi"
                            name="visi"
                            value={formData.visi}
                            onChange={handleChange}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label
                            className="block text-sm font-medium mb-1"
                            htmlFor="misi"
                        >
                            Misi (Pisahkan dengan baris baru)
                        </label>
                        <textarea
                            id="misi"
                            name="misi"
                            value={formData.misi}
                            onChange={handleChange}
                            rows={6}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-[#129990] text-white hover:bg-[#107c77] transition flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
