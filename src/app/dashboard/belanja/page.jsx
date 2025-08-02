'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/Header'
import { Loader2, Pencil, Trash2, Plus } from 'lucide-react'
import ProdukForm from '@/components/ProdukForm'

export default function BelanjaPage() {
    const [activeTab, setActiveTab] = useState('list')
    const [produk, setProduk] = useState([])
    const [loading, setLoading] = useState(false)
    const [editData, setEditData] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)

    useEffect(() => {
        async function fetchProduk() {
            setLoading(true)
            try {
                const res = await fetch('/api/produk')
                const data = await res.json()
                setProduk(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Gagal mengambil produk:', err)
            } finally {
                setLoading(false)
            }
        }

        if (activeTab === 'list') {
            fetchProduk()
        }
    }, [activeTab])

    const handleDelete = async (id) => {
        const confirmDelete = confirm('Yakin ingin menghapus produk ini?')
        if (!confirmDelete) return

        try {
            const res = await fetch('/api/produk', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })

            if (!res.ok) throw new Error('Gagal menghapus data')
            setProduk(prev => prev.filter(item => item.id !== id))
        } catch (err) {
            console.error(err)
            alert('Terjadi kesalahan saat menghapus.')
        }
    }

    const totalPages = Math.ceil(produk.length / itemsPerPage)
    const paginatedData = produk.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const handleSubmit = async (formData) => {
        try {
            const res = await fetch('/api/produk', {
                method: formData.id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Gagal menyimpan data')

            const newData = await res.json()

            if (formData.id) {
                // Edit
                setProduk((prev) =>
                    prev.map((item) => (item.id === formData.id ? newData : item))
                )
            } else {
                // Tambah
                setProduk((prev) => [newData, ...prev])
            }

            setActiveTab('list')
            setEditData(null)
        } catch (err) {
            console.error(err)
            alert('Terjadi kesalahan saat menyimpan.')
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100 ml-64">
            <Sidebar />
            <main className="flex-1">
                <DashboardHeader title="Belanja Produk" />
                <div className="p-6 space-y-4">
                    {activeTab === 'form' ? (
                        <ProdukForm
                            initialData={editData}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setActiveTab('list')
                                setEditData(null)
                            }}
                        />
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-700">Daftar Produk</h2>
                                <button
                                    className="flex items-center gap-2 bg-[#129990] text-white px-4 py-2 rounded-md text-sm hover:bg-[#107e7a]"
                                    onClick={() => {
                                        setEditData(null)
                                        setActiveTab('form')
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Produk
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
                                                <th className="px-4 py-3 text-left text-sm font-medium">Gambar</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Nama</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Harga</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Kontak</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm">
                                            {produk.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                        Tidak ada produk.
                                                    </td>
                                                </tr>
                                            ) : (
                                                paginatedData.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="px-4 py-3">
                                                            {item.gambar ? (
                                                                <img
                                                                    src={item.gambar}
                                                                    alt={item.nama}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400 italic">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">{item.nama}</td>
                                                        <td className="px-4 py-3">Rp {item.harga.toLocaleString()}</td>
                                                        <td className="px-4 py-3">{item.kontak || '-'}</td>
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
                                        produk
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
