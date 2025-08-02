'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/Header'
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react'
import PengumumanForm from '@/components/PengumumanForm' // pastikan komponen ini tersedia

export default function PengumumanPage() {
    const [activeTab, setActiveTab] = useState('list')
    const [pengumuman, setPengumuman] = useState([])
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    useEffect(() => {
        async function fetchPengumuman() {
            setLoading(true)
            try {
                const res = await fetch('/api/pengumuman')
                const data = await res.json()
                setPengumuman(Array.isArray(data.data) ? data.data : [])
            } catch (err) {
                console.error('Gagal mengambil pengumuman:', err)
            } finally {
                setLoading(false)
            }
        }

        if (activeTab === 'list') {
            fetchPengumuman()
        }
    }, [activeTab])

    const handleSubmit = async (form) => {
        const method = form.id ? 'PUT' : 'POST'
        const res = await fetch('/api/pengumuman', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })

        const result = await res.json()
        if (!res.ok) {
            alert(result.error || 'Terjadi kesalahan')
            return
        }

        // Tambahkan aksi setelah sukses
        alert('Pengumuman berhasil disimpan!')
        window.location.href = '/dashboard/pengumuman'
    }

    const handleDelete = async (id) => {
        const confirmDelete = confirm('Yakin ingin menghapus pengumuman ini?')
        if (!confirmDelete) return

        try {
            const res = await fetch('/api/pengumuman', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (!res.ok) throw new Error('Gagal menghapus data')
            setPengumuman(prev => prev.filter(item => item.id !== id))
        } catch (err) {
            console.error(err)
            alert('Terjadi kesalahan saat menghapus.')
        }
    }

    const totalPages = Math.ceil(pengumuman.length / itemsPerPage)
    const paginatedData = pengumuman.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    return (
        <div className="flex min-h-screen bg-gray-100 ml-64">
            <Sidebar />
            <main className="flex-1">
                <DashboardHeader title="Pengumuman" />
                <div className="p-6 space-y-4">
                    {activeTab === 'form' ? (
                        <PengumumanForm
                            initialData={editData}
                            onCancel={() => {
                                setActiveTab('list')
                                setEditData(null)
                            }}
                            onSubmit={handleSubmit}
                        />
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-700">Daftar Pengumuman</h2>
                                <button
                                    className="flex items-center gap-2 bg-[#129990] text-white px-4 py-2 rounded-md text-sm hover:bg-[#107e7a]"
                                    onClick={() => {
                                        setEditData(null)
                                        setActiveTab('form')
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Pengumuman
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
                                                <th className="px-4 py-3 text-left text-sm font-medium">Judul</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Tanggal</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {pengumuman.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                                                        Tidak ada pengumuman.
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3">{item.judul}</td>
                                                        <td className="px-4 py-3">
                                                            {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex gap-2">
                                                                <button
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    onClick={() => {
                                                                        setEditData(item)
                                                                        setActiveTab('form')
                                                                    }}
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    className="text-red-600 hover:text-red-800"
                                                                    onClick={() => handleDelete(item.id)}
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
                                    <div className="text-sm text-gray-800">
                                        Tampilkan:
                                        <select
                                            className="border border-gray-300 rounded px-2 py-1 ml-1 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#129990]"
                                            value={itemsPerPage}
                                            onChange={(e) => {
                                                setItemsPerPage(Number(e.target.value))
                                                setCurrentPage(1)
                                            }}
                                        >
                                            {[5, 10, 20, 50].map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>{' '}
                                        pengumuman
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-[#129990]">
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded text-[#129990] hover:bg-[#e0f7f6] disabled:opacity-50"
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            &laquo; Prev
                                        </button>
                                        <span>
                                            {currentPage} dari {totalPages}
                                        </span>
                                        <button
                                            className="px-3 py-1 border border-gray-300 rounded text-[#129990] hover:bg-[#e0f7f6] disabled:opacity-50"
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next &raquo;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
