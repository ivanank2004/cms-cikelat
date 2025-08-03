"use client";

import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function EditBansosModal({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSubmit,
    isSubmitting = false,
}) {
    if (!isOpen) return null;

    function handleChange(field, value) {
        const updated = {
            ...formData,
            [field]: value === "" ? "" : Number(value),
        };
        setFormData(updated);
    }

    async function handleSubmit() {
        const toastId = toast.loading("Menyimpan data bantuan sosial...");
        try {
            await onSubmit();
            toast.success("Data bantuan sosial berhasil diperbarui", {
                id: toastId,
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Gagal menyimpan perubahan", { id: toastId });
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg mx-4 relative">
                {/* Tombol Tutup */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                <h3 className="text-xl font-bold mb-6 text-gray-800">
                    Edit Data Bantuan Sosial
                </h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4"
                >
                    {[
                        { label: "BPJS PBI", field: "bpjs_pbi" },
                        { label: "PKH", field: "pkh" },
                        { label: "BPNT", field: "bpnt" },
                        { label: "BLT", field: "blt" },
                    ].map(({ label, field }) => (
                        <div key={field}>
                            <label className="block text-sm font-medium mb-1">
                                {label}
                            </label>
                            <input
                                type="number"
                                value={formData[field]}
                                onChange={(e) =>
                                    handleChange(field, e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                            />
                        </div>
                    ))}

                    <div className="flex justify-end gap-2 mt-6">
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
