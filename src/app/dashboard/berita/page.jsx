"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/Header";
import BeritaForm from "@/components/BeritaForm";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function BeritaPage() {
    const [activeTab, setActiveTab] = useState("list"); // 'list' | 'form'
    const [berita, setBerita] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for confirm modal
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState({
        title: "",
        message: "",
        onConfirm: () => {},
    });
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);

    useEffect(() => {
        async function fetchBerita() {
            setLoading(true);
            try {
                const res = await fetch("/api/berita");
                const data = await res.json();
                setBerita(data);
            } catch (error) {
                console.error("Gagal mengambil berita:", error);
                toast.error("Gagal memuat data berita");
            } finally {
                setLoading(false);
            }
        }

        if (activeTab === "list") {
            fetchBerita();
        }
    }, [activeTab]);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        const toastId = toast.loading(
            formData.id ? "Memperbarui berita..." : "Menambahkan berita..."
        );

        try {
            const form = new FormData();

            for (const key in formData) {
                // kalau gambar berupa File, masukkan langsung
                if (key === "gambar" && formData.gambar instanceof File) {
                    form.append("gambar", formData.gambar);
                } else {
                    form.append(key, formData[key]);
                }
            }

            const res = await fetch("/api/berita", {
                method: "POST",
                body: form, // kirim sebagai multipart/form-data
            });

            if (!res.ok) throw new Error("Gagal menyimpan data");

            toast.success(
                formData.id
                    ? "Berita berhasil diperbarui"
                    : "Berita berhasil ditambahkan",
                { id: toastId }
            );
            setActiveTab("list");
            setEditData(null);
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan berita", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRequest = (id, judul) => {
        setConfirmAction({
            title: "Konfirmasi Hapus",
            message: `Apakah Anda yakin ingin menghapus berita "${judul}"? Tindakan ini tidak dapat dibatalkan.`,
            onConfirm: () => handleDelete(id),
        });
        setConfirmModalOpen(true);
    };

    const handleDelete = async (id) => {
        setIsConfirmLoading(true);
        const toastId = toast.loading("Menghapus berita...");

        try {
            const res = await fetch("/api/berita", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) throw new Error("Gagal menghapus data");
            setBerita((prev) => prev.filter((item) => item.id !== id));
            toast.success("Berita berhasil dihapus", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Gagal menghapus berita", { id: toastId });
        } finally {
            setIsConfirmLoading(false);
            setConfirmModalOpen(false);
        }
    };

    const totalPages = Math.ceil(berita.length / itemsPerPage);
    const paginatedData = berita.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex min-h-screen bg-gray-100 ml-64">
            <Sidebar />
            <main className="flex-1">
                <DashboardHeader title="Berita" />
                <div className="p-6 space-y-4">
                    {activeTab === "form" ? (
                        <BeritaForm
                            initialData={editData}
                            onCancel={() => {
                                setActiveTab("list");
                                setEditData(null);
                            }}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-700">
                                    Daftar Berita
                                </h2>
                                <button
                                    className="flex items-center gap-2 bg-[#129990] text-white px-4 py-2 rounded-md text-sm hover:bg-[#107e7a]"
                                    onClick={() => {
                                        setEditData(null);
                                        setActiveTab("form");
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Berita
                                </button>
                            </div>

                            <div className="bg-white shadow-md rounded-xl overflow-x-auto">
                                {loading ? (
                                    <div className="flex justify-center items-center py-10">
                                        <Loader2 className="w-6 h-6 text-[#129990] animate-spin" />
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200 text-gray-800">
                                        <thead className="bg-[#129990] text-white">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-medium">
                                                    Gambar
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">
                                                    Judul
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">
                                                    Tanggal
                                                </th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {berita.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="px-4 py-4 text-center text-gray-500"
                                                    >
                                                        Tidak ada berita.
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3">
                                                            {item.gambar ? (
                                                                <img
                                                                    src={
                                                                        item.gambar
                                                                    }
                                                                    alt={
                                                                        item.judul
                                                                    }
                                                                    className="w-20 h-14 object-cover rounded-md border"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400 italic">
                                                                    Tidak ada
                                                                    gambar
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {item.judul}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {new Date(
                                                                item.tanggal
                                                            ).toLocaleDateString(
                                                                "id-ID",
                                                                {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    onClick={() => {
                                                                        setEditData(
                                                                            item
                                                                        );
                                                                        setActiveTab(
                                                                            "form"
                                                                        );
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="text-red-600 hover:text-red-800"
                                                                    onClick={() =>
                                                                        handleDeleteRequest(
                                                                            item.id,
                                                                            item.judul
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                )}
                                <div className="flex justify-between items-center p-4">
                                    {/* Show per page */}
                                    <div className="text-sm text-gray-800">
                                        Tampilkan:{" "}
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1 ml-1 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(
                                                    Number(e.target.value)
                                                );
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {[5, 10, 20, 50].map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>{" "}
                                        berita
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center gap-2 text-sm text-[#129990]">
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded text-[#129990] hover:bg-[#e0f7f6] disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            &laquo; Prev
                                        </button>
                                        <span>
                                            {currentPage} dari {totalPages}
                                        </span>
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded text-[#129990] hover:bg-[#e0f7f6] disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Next &raquo;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Render Confirm Modal */}
                    <ConfirmModal
                        isOpen={confirmModalOpen}
                        onClose={() => setConfirmModalOpen(false)}
                        onConfirm={confirmAction.onConfirm}
                        title={confirmAction.title}
                        message={confirmAction.message}
                        isLoading={isConfirmLoading}
                    />
                </div>
            </main>
        </div>
    );
}
