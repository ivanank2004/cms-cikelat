"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function EditStatistikModal({
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
        setFormData((prev) => ({
            ...prev,
            [name]: value === "" ? "" : Number(value),
        }));
    }

    function handleNestedChange(field, index, key, value) {
        setFormData((prev) => {
            const updated = [...prev[field]];
            updated[index][key] =
                value === ""
                    ? ""
                    : typeof updated[index][key] === "number"
                    ? Number(value)
                    : value;
            return { ...prev, [field]: updated };
        });
    }

    const nestedFields = [
        {
            key: "kelompok_umur",
            label: "Kelompok Umur",
            labelKey: "rentang_umur",
            jumlahKey: "jumlah",
        },
        {
            key: "dusun",
            label: "Dusun",
            labelKey: "nama_dusun",
            jumlahKey: "jumlah",
        },
        {
            key: "pendidikan_terakhir",
            label: "Pendidikan Terakhir",
            labelKey: "jenjang",
            jumlahKey: "jumlah",
        },
        {
            key: "pekerjaan",
            label: "Pekerjaan",
            labelKey: "pekerjaan",
            jumlahKey: "jumlah",
        },
        {
            key: "status_perkawinan",
            label: "Status Perkawinan",
            labelKey: "status",
            jumlahKey: "jumlah",
        },
        { key: "agama", label: "Agama", labelKey: "nama", jumlahKey: "jumlah" },
    ];

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto relative">
                {/* Tombol silang */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                    disabled={isSubmitting}
                >
                    &times;
                </button>

                <h3 className="text-xl font-bold mb-6 text-gray-800">
                    Edit Statistik Penduduk
                </h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="space-y-5"
                >
                    {/* Data Utama */}
                    {[
                        "jumlah_penduduk",
                        "jumlah_kk",
                        "laki_laki",
                        "perempuan",
                    ].map((field) => (
                        <div key={field}>
                            <label
                                className="block text-sm font-medium mb-1 capitalize"
                                htmlFor={field}
                            >
                                {field.replace("_", " ")}
                            </label>
                            <input
                                type="number"
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2"
                                disabled={isSubmitting}
                            />
                        </div>
                    ))}

                    {/* Statistik Lanjutan */}
                    {nestedFields.map(({ key, label, labelKey, jumlahKey }) => (
                        <div key={key}>
                            <h4 className="text-md font-semibold mt-6 mb-2">
                                {label}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {formData[key]?.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            value={item[labelKey]}
                                            disabled
                                            className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={item[jumlahKey]}
                                            onChange={(e) =>
                                                handleNestedChange(
                                                    key,
                                                    idx,
                                                    jumlahKey,
                                                    e.target.value
                                                )
                                            }
                                            className="w-28 border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Tombol Aksi */}
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
