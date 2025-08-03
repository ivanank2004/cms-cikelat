"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function PengumumanForm({
    initialData = null,
    onSubmit,
    onCancel,
}) {
    const [form, setForm] = useState({
        judul: "",
        isi: "",
        // tanggal dihapus, akan diatur otomatis
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                // tanggal tidak lagi disertakan di form
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const toastId = toast.loading("Menyimpan pengumuman...");

        try {
            // Tanggal saat ini dalam format YYYY-MM-DD
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${String(
                today.getMonth() + 1
            ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

            // Tambahkan tanggal ke form data
            const submitData = {
                ...form,
                tanggal: initialData?.tanggal || formattedDate, // Gunakan tanggal lama jika edit, atau tanggal hari ini jika tambah baru
            };

            await onSubmit(submitData);
            toast.success("Pengumuman berhasil disimpan", { id: toastId });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Gagal menyimpan pengumuman", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-12rem)]">
            {/* Header Fixed */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
                <h3 className="text-xl font-bold text-gray-800">
                    {initialData ? "Edit Pengumuman" : "Tambah Pengumuman"}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition text-sm font-medium disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-4 py-2 rounded-md bg-[#129990] text-white hover:bg-[#107c77] transition text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting && (
                            <Loader2 size={16} className="animate-spin" />
                        )}
                        {isSubmitting ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </div>

            {/* Content Scrollable */}
            <div className="flex-grow overflow-y-auto p-6">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Judul
                        </label>
                        <input
                            type="text"
                            name="judul"
                            value={form.judul}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Isi Pengumuman
                        </label>
                        <textarea
                            name="isi"
                            value={form.isi}
                            onChange={handleChange}
                            rows="10"
                            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
