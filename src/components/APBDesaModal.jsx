"use client";

import { Loader2, Trash2 } from "lucide-react"; // Import Loader2

export default function EditAPBDesaModal({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSubmit,
    onDelete,
    onDeleteAll,
    isSubmitting, // Tambahkan prop isSubmitting
}) {
    if (!isOpen) return null;

    function handleChange(index, field, value) {
        const updated = [...formData];
        updated[index][field] =
            value === ""
                ? ""
                : field === "pendapatan" || field === "belanja"
                ? Number(value)
                : value;
        setFormData(updated);
    }

    function handleAddYear() {
        if (formData.length === 0) {
            const currentYear = new Date().getFullYear();
            const newEntry = {
                tahun: currentYear,
                pendapatan: 0,
                belanja: 0,
                uraian_pendapatan: "",
                uraian_belanja: "",
            };
            setFormData([newEntry]);
            return;
        }

        const lastYear = Math.max(...formData.map((d) => d.tahun));
        const newEntry = {
            tahun: lastYear + 1,
            pendapatan: 0,
            belanja: 0,
            uraian_pendapatan: "",
            uraian_belanja: "",
        };
        setFormData([newEntry, ...formData]);
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
                {/* Header Fixed */}
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
                    <h3 className="text-xl font-bold text-gray-800">
                        Edit APB Desa
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting} // Nonaktifkan saat submitting
                            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition text-sm font-medium disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={isSubmitting} // Nonaktifkan saat submitting
                            className="px-4 py-2 rounded-md bg-[#129990] text-white hover:bg-[#107c77] transition text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <Loader2 size={16} className="animate-spin" />
                            )}
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </div>

                {/* Konten Scrollable */}
                <div className="flex-grow overflow-y-auto p-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSubmit();
                        }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="button"
                                onClick={handleAddYear}
                                className="text-sm text-[#129990] font-medium hover:underline"
                            >
                                + Tambah Data Tahun
                            </button>
                            <button
                                type="button"
                                onClick={onDeleteAll}
                                className="text-sm text-red-600 font-medium hover:underline flex items-center gap-1"
                            >
                                <Trash2 size={14} /> Hapus Semua Data
                            </button>
                        </div>

                        {formData.length > 0 ? (
                            formData.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg relative group"
                                >
                                    <button
                                        type="button"
                                        onClick={() => onDelete(item.tahun)}
                                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Hapus data tahun ${item.tahun}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Tahun
                                                </label>
                                                <input
                                                    type="number"
                                                    value={item.tahun}
                                                    disabled
                                                    className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Pendapatan (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={item.pendapatan}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "pendapatan",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Belanja (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={item.belanja}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "belanja",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Uraian Pendapatan
                                                </label>
                                                <textarea
                                                    value={
                                                        item.uraian_pendapatan
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "uraian_pendapatan",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows="3"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    placeholder="Contoh: Dana Desa, Bantuan Provinsi, dll."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Uraian Belanja
                                                </label>
                                                <textarea
                                                    value={item.uraian_belanja}
                                                    onChange={(e) =>
                                                        handleChange(
                                                            index,
                                                            "uraian_belanja",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows="3"
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    placeholder="Contoh: Pembangunan jalan, operasional kantor, dll."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <p>Tidak ada data APBD.</p>
                                <p className="text-sm">
                                    Klik "+ Tambah Data Tahun" untuk memulai.
                                </p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
