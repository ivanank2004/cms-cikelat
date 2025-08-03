"use client";

import { useState, useEffect } from "react";
import { uploadImage } from "@/lib/uploadImageToSupabase";
import { getImageUrl } from "@/lib/getImageURL";
import toast from "react-hot-toast";

export default function BeritaForm({ initialData, onCancel, onSubmit }) {
    const [form, setForm] = useState({
        judul: "",
        tanggal: "",
        gambar: "",
        sumber: "",
        isi: "",
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (initialData) {
            const date = new Date(initialData.tanggal);

            // Ambil tahun, bulan, tanggal dari waktu lokal
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            const formattedDate = `${year}-${month}-${day}`;

            setForm({
                ...initialData,
                tanggal: formattedDate,
            });
        }
    }, [initialData]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleFileChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);
        setPreview(fileUrl);

        try {
            const path = await uploadImage(file, "berita");
            const publicUrl = getImageUrl(path);
            setForm((prev) => ({ ...prev, gambar: publicUrl }));
            toast.success("Gambar berhasil diupload");
        } catch (error) {
            toast.error("Gagal upload gambar");
            console.error(error);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit(form);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-xl shadow-md text-gray-800"
        >
            {/* Preview Gambar */}
            {preview && (
                <div className="flex justify-center">
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-h-48 rounded-lg border border-gray-300 object-cover"
                    />
                </div>
            )}

            {/* Upload Gambar */}
            <div>
                <label className="block text-sm font-semibold text-gray-800">
                    Upload Gambar
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                />
            </div>

            {/* Judul */}
            <div>
                <label className="block text-sm font-semibold text-gray-800">
                    Judul
                </label>
                <input
                    type="text"
                    name="judul"
                    value={form.judul}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                />
            </div>

            {/* Tanggal */}
            <div>
                <label className="block text-sm font-semibold text-gray-800">
                    Tanggal
                </label>
                <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                />
            </div>

            {/* Sumber */}
            <div>
                <label className="block text-sm font-semibold text-gray-800">
                    Sumber
                </label>
                <input
                    type="text"
                    name="sumber"
                    value={form.sumber}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                />
            </div>

            {/* Isi */}
            <div>
                <label className="block text-sm font-semibold text-gray-800">
                    Isi Berita
                </label>
                <textarea
                    name="isi"
                    value={form.isi}
                    onChange={handleChange}
                    rows={6}
                    className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                />
            </div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#129990] text-white hover:bg-[#0f7f7a]"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}
