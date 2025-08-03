"use client";

import { useEffect, useState } from "react";
import EditAPBDesaModal from "./APBDesaModal";
import ConfirmModal from "./ConfirmModal"; // Import ConfirmModal
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function KomponenAPBDesa() {
    const [apbdesData, setApbdesData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [formData, setFormData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State untuk modal konfirmasi
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        title: "",
        message: "",
        onConfirm: () => {},
    });
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    async function fetchData() {
        // ... (kode fetchData tetap sama)
        try {
            setIsLoading(true);
            const res = await fetch("/api/apbdes");
            if (!res.ok) throw new Error("Gagal memuat data awal.");
            const data = await res.json();
            const sortedData = data.sort((a, b) => b.tahun - a.tahun);
            setApbdesData(sortedData);
            setFormData(sortedData);
        } catch (err) {
            console.error("Gagal fetch data APBDes:", err);
            toast.error(err.message || "Gagal memuat data APBD.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = () => {
        setFormData([...apbdesData]);
        setEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditModalOpen(false);
    };

    const handleSubmit = async () => {
        // ... (kode handleSubmit tetap sama)
        setIsSubmitting(true);
        const toastId = toast.loading("Menyimpan perubahan...");
        try {
            const res = await fetch("/api/apbdes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error("Gagal menyimpan data");
            await fetchData();
            toast.success("Data berhasil diperbarui!", { id: toastId });
            setEditModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan perubahan.", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fungsi untuk membuka modal konfirmasi HAPUS SATU
    const handleDeleteRequest = (tahun) => {
        setConfirmAction({
            title: "Konfirmasi Hapus",
            message: `Apakah Anda yakin ingin menghapus data tahun ${tahun}? Tindakan ini tidak dapat diurungkan.`,
            onConfirm: () => handleDelete(tahun),
        });
        setConfirmModalOpen(true);
    };

    // Fungsi untuk membuka modal konfirmasi HAPUS SEMUA
    const handleDeleteAllRequest = () => {
        setConfirmAction({
            title: "Konfirmasi Hapus Semua Data",
            message:
                "Apakah Anda yakin ingin menghapus SEMUA data APBD? Tindakan ini permanen.",
            onConfirm: handleDeleteAll,
        });
        setConfirmModalOpen(true);
    };

    // Logika untuk menghapus satu data
    const handleDelete = async (tahun) => {
        setIsConfirmLoading(true);
        const toastId = toast.loading(`Menghapus data tahun ${tahun}...`);
        try {
            const res = await fetch("/api/apbdes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tahun }),
            });
            if (!res.ok) throw new Error("Gagal menghapus data");
            setFormData(formData.filter((item) => item.tahun !== tahun));
            toast.success(`Data tahun ${tahun} berhasil dihapus.`, {
                id: toastId,
            });
            await fetchData(); // Sinkronisasi ulang
            setConfirmModalOpen(false); // Tutup modal konfirmasi
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus data.", { id: toastId });
        } finally {
            setIsConfirmLoading(false);
        }
    };

    // Logika untuk menghapus semua data
    const handleDeleteAll = async () => {
        setIsConfirmLoading(true);
        const toastId = toast.loading("Menghapus semua data...");
        try {
            const res = await fetch("/api/apbdes", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deleteAll: true }),
            });
            if (!res.ok) throw new Error("Gagal menghapus semua data");
            setFormData([]);
            toast.success("Semua data berhasil dihapus.", { id: toastId });
            await fetchData(); // Sinkronisasi ulang
            setConfirmModalOpen(false); // Tutup modal konfirmasi
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus semua data.", { id: toastId });
        } finally {
            setIsConfirmLoading(false);
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
            {/* ... (kode tampilan utama tetap sama) ... */}
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
                            {apbdesData.length > 0 ? (
                                <>
                                    <div className="space-y-3">
                                        {apbdesData.map((item) => (
                                            <div
                                                key={item.tahun}
                                                className="border-b pb-2"
                                            >
                                                <div className="flex justify-between text-sm text-gray-800 font-medium">
                                                    <span>{item.tahun}</span>
                                                    <span>
                                                        {formatRupiah(
                                                            item.pendapatan
                                                        )}
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
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Data tidak tersedia.
                                </p>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
                            <h4 className="text-base font-semibold text-gray-700 mb-4">
                                Belanja
                            </h4>
                            {apbdesData.length > 0 ? (
                                <>
                                    <div className="space-y-3">
                                        {apbdesData.map((item) => (
                                            <div
                                                key={item.tahun}
                                                className="border-b pb-2"
                                            >
                                                <div className="flex justify-between text-sm text-gray-800 font-medium">
                                                    <span>{item.tahun}</span>
                                                    <span>
                                                        {formatRupiah(
                                                            item.belanja
                                                        )}
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
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Data tidak tersedia.
                                </p>
                            )}
                        </div>
                    </div>

                    <EditAPBDesaModal
                        isOpen={editModalOpen}
                        onClose={handleCloseModal}
                        formData={formData}
                        setFormData={setFormData}
                        onSubmit={handleSubmit}
                        onDelete={handleDeleteRequest} // Ganti dengan fungsi request
                        onDeleteAll={handleDeleteAllRequest} // Ganti dengan fungsi request
                        isSubmitting={isSubmitting}
                    />
                </>
            )}

            {/* Render Modal Konfirmasi */}
            <ConfirmModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={confirmAction.onConfirm}
                title={confirmAction.title}
                message={confirmAction.message}
                isLoading={isConfirmLoading}
            />
        </div>
    );
}
