"use client";

import { useEffect, useState } from "react";
import EditAPBDesaModal from "./APBDesaModal";
import { Loader2 } from "lucide-react";

export default function KomponenAPBDesa() {
    const [apbdesData, setApbdesData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchData() {
        try {
            setIsLoading(true);
            const res = await fetch("/api/apbdes");
            const data = await res.json();
            // Urutkan data berdasarkan tahun secara descending
            const sortedData = data.sort((a, b) => b.tahun - a.tahun);
            setApbdesData(sortedData);
            setFormData(sortedData);
        } catch (err) {
            console.error("Gagal fetch data APBDes:", err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = () => {
        // Simpan salinan data asli saat modal dibuka
        setFormData([...apbdesData]);
        setEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditModalOpen(false);
        // Tidak perlu mengembalikan data, karena perubahan disimpan atau dibatalkan secara eksplisit
    };

    const handleSubmit = async () => {
        // Kirim data yang ada di formData (yang sudah diubah di modal)
        await fetch("/api/apbdes", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        setEditModalOpen(false);
        fetchData(); // Ambil data terbaru dari server
    };

    const handleDelete = async (tahun) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data tahun ${tahun}?`)) {
            await fetch("/api/apbdes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tahun }),
            });
            // Perbarui state formData secara langsung untuk responsivitas UI
            setFormData(formData.filter((item) => item.tahun !== tahun));
            // Ambil data terbaru dari server untuk sinkronisasi
            fetchData();
        }
    };

    const handleDeleteAll = async () => {
        if (
            confirm(
                "Apakah Anda yakin ingin menghapus SEMUA data APBD? Tindakan ini tidak dapat diurungkan."
            )
        ) {
            await fetch("/api/apbdes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deleteAll: true }),
            });
            // Kosongkan state formData
            setFormData([]);
            // Ambil data terbaru dari server (seharusnya kosong)
            fetchData();
        }
    };

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);

    const totalPendapatan = apbdesData.reduce(
        (sum, d) => sum + d.pendapatan,
        0
    );
    const totalBelanja = apbdesData.reduce((sum, d) => sum + d.belanja, 0);

    return (
        <div className="flex flex-col gap-6 min-h-[200px]">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[200px] gap-2 text-gray-500">
                    <Loader2 className="animate-spin w-8 h-8" />
                    <p className="text-sm font-medium">Memuat Data...</p>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Anggaran Pendapatan & Belanja Desa
                        </h3>
                        <button
                            onClick={handleOpenModal}
                            className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium"
                        >
                            Edit Data
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
                            <h4 className="text-base font-semibold text-gray-700 mb-4">
                                Pendapatan
                            </h4>
                            <div className="space-y-3">
                                {apbdesData.map((item) => (
                                    <div
                                        key={item.tahun}
                                        className="border-b pb-2"
                                    >
                                        <div className="flex justify-between text-sm text-gray-800 font-medium">
                                            <span>{item.tahun}</span>
                                            <span>
                                                {formatRupiah(item.pendapatan)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
                                            {item.uraian_pendapatan}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-sm font-bold text-right text-green-700">
                                Total: {formatRupiah(totalPendapatan)}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
                            <h4 className="text-base font-semibold text-gray-700 mb-4">
                                Belanja
                            </h4>
                            <div className="space-y-3">
                                {apbdesData.map((item) => (
                                    <div
                                        key={item.tahun}
                                        className="border-b pb-2"
                                    >
                                        <div className="flex justify-between text-sm text-gray-800 font-medium">
                                            <span>{item.tahun}</span>
                                            <span>
                                                {formatRupiah(item.belanja)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">
                                            {item.uraian_belanja}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-sm font-bold text-right text-red-700">
                                Total: {formatRupiah(totalBelanja)}
                            </div>
                        </div>
                    </div>

                    <EditAPBDesaModal
                        isOpen={editModalOpen}
                        onClose={handleCloseModal}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        onDelete={handleDelete}
                        onDeleteAll={handleDeleteAll}
                    />
                </>
            )}
        </div>
    );
}
