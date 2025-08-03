"use client";

import { useEffect, useState } from "react";
import { uploadImage } from "@/lib/uploadImageToSupabase"; // Pastikan path sesuai
import { getImageUrl } from "@/lib/getImageURL";
import { Loader2, Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function ProdukForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}) {
    const [form, setForm] = useState({
        nama: "",
        harga: "",
        kontak: "",
        gambar: "",
        deskripsi: "",
    });

    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
            setPreview(initialData.gambar || null);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Mengupload gambar...");
        try {
            const path = await uploadImage(file, "produk");
            const publicUrl = getImageUrl(path);

            setForm((prev) => ({ ...prev, gambar: publicUrl }));
            setPreview(publicUrl);
            toast.success("Gambar berhasil diupload", { id: toastId });
        } catch (error) {
            toast.error("Gagal upload gambar", { id: toastId });
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, gambar: "" }));
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form);
    };

    return (
        <div className="bg-white rounded-xl shadow-md flex flex-col h-[calc(100vh-12rem)]">
            {/* Header Fixed */}
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-xl z-10">
                <h3 className="text-xl font-bold text-gray-800">
                    {initialData ? "Edit Produk" : "Tambah Produk"}
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
                            onChange={handleImageChange}
                            className="w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#129990]/20 file:text-[#129990] file:cursor-pointer"
                            disabled={uploading || isSubmitting}
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

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Nama Produk
                        </label>
                        <input
                            type="text"
                            name="nama"
                            value={form.nama}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Harga
                        </label>
                        <input
                            type="number"
                            name="harga"
                            value={form.harga}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Kontak
                        </label>
                        <input
                            type="text"
                            name="kontak"
                            value={form.kontak}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                            Deskripsi
                        </label>
                        <textarea
                            name="deskripsi"
                            value={form.deskripsi}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
                            rows="4"
                            disabled={isSubmitting}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
