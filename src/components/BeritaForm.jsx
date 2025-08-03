"use client";

import { useState, useEffect } from "react";
import { uploadImage } from "@/lib/uploadImageToSupabase";
import { getImageUrl } from "@/lib/getImageURL";
import { Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function BeritaForm({ initialData, onCancel, onSubmit }) {
    const [form, setForm] = useState({
        judul: "",
        gambar: "",
        sumber: "",
        isi: "",
        // tanggal dihapus, akan diatur otomatis
    });
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                // tanggal tidak lagi disertakan di form
            });
            setPreview(initialData.gambar || null);
        }
    }, [initialData]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Mengupload gambar...");

        try {
            const fileUrl = URL.createObjectURL(file);
            setPreview(fileUrl);

            const path = await uploadImage(file, "berita");
            const publicUrl = getImageUrl(path);
            setForm((prev) => ({ ...prev, gambar: publicUrl }));
            toast.success("Gambar berhasil diupload", { id: toastId });
        } catch (error) {
            toast.error("Gagal upload gambar", { id: toastId });
            console.error(error);
        } finally {
            setUploading(false);
        }
    }

    function handleRemoveImage() {
        setForm((prev) => ({ ...prev, gambar: "" }));
        setPreview(null);
    }

    async function handleSubmit() {
        setIsSubmitting(true);
        const toastId = toast.loading("Menyimpan berita...");

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
            toast.success("Berita berhasil disimpan", { id: toastId });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Gagal menyimpan berita", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-12rem)]">
            {/* Header Fixed */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
                <h3 className="text-xl font-bold text-gray-800">
                    {initialData ? "Edit Berita" : "Tambah Berita"}
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting || uploading}
                        className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition text-sm font-medium disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || uploading}
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
                <form className="space-y-6">
                    {/* Preview Gambar */}
                    {preview && (
                        <div className="flex justify-center">
                            <div className="relative inline-block">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="max-h-48 rounded-lg border border-gray-300 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    disabled={isSubmitting}
                                >
                                    <Trash size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Upload Gambar */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Upload Gambar
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#129990]/20 file:text-[#129990] file:cursor-pointer"
                            disabled={isSubmitting || uploading}
                        />
                        {uploading && (
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                <Loader2
                                    size={16}
                                    className="animate-spin mr-2"
                                />{" "}
                                Mengupload...
                            </p>
                        )}
                    </div>

                    {/* Judul */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Judul
                        </label>
                        <input
                            type="text"
                            name="judul"
                            value={form.judul}
                            onChange={handleChange}
                            required
                            className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Sumber */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Sumber
                        </label>
                        <input
                            type="text"
                            name="sumber"
                            value={form.sumber}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Isi */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Isi Berita
                        </label>
                        <textarea
                            name="isi"
                            value={form.isi}
                            onChange={handleChange}
                            rows={8}
                            className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
