'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Newspaper, Megaphone, ShoppingBag, Users, Loader2 } from 'lucide-react'
import DashboardHeader from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
    const router = useRouter()
    const [currentTime, setCurrentTime] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        berita: 0,
        pengumuman: 0,
        produk: 0,
        penduduk: 0,
        laki_laki: 0,
        perempuan: 0,
    })

    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }))
        }

        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' })
        router.push('/')
    }

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/dashboard')
                const data = await res.json()
                setStats(data)
            } catch (error) {
                console.error('Gagal mengambil data dashboard:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    const cards = [
        {
            title: 'Total Berita',
            value: stats.berita,
            icon: <Newspaper className="w-8 h-8 text-white" />,
            bg: 'bg-blue-500',
        },
        {
            title: 'Total Pengumuman',
            value: stats.pengumuman,
            icon: <Megaphone className="w-8 h-8 text-white" />,
            bg: 'bg-yellow-500',
        },
        {
            title: 'Produk Belanja',
            value: stats.produk,
            icon: <ShoppingBag className="w-8 h-8 text-white" />,
            bg: 'bg-green-500',
        },
        {
            title: 'Total Penduduk',
            value: stats.penduduk,
            icon: <Users className="w-8 h-8 text-white" />,
            bg: 'bg-purple-500',
        },
    ]

    const total = stats.laki_laki + stats.perempuan
    const persentaseLaki = total > 0 ? ((stats.laki_laki / total) * 100).toFixed(0) : 0
    const persentasePerempuan = total > 0 ? ((stats.perempuan / total) * 100).toFixed(0) : 0

    return (
        <div className="flex min-h-screen bg-gray-100 ml-64">
            <Sidebar />
            <main className="flex-1">
                <DashboardHeader title="Profil Desa" />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] gap-2 text-gray-500">
                        <Loader2 className="animate-spin w-10 h-10" />
                        <p className="text-sm font-medium">Memuat Data...</p>
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <section className="p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Statistik Utama Desa</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {cards.map((card, index) => (
                                    <div key={index} className="bg-white shadow-md rounded-xl px-4 py-6 flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${card.bg}`}>
                                            {card.icon}
                                        </div>
                                        <div>
                                            <p className="text-gray-600 text-sm">{card.title}</p>
                                            <p className="text-xl font-bold text-gray-800">{card.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Statistik Populasi, Aksi Cepat, Aktivitas Terbaru */}
                        <section className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Kolom kiri */}
                            <div className="flex flex-col gap-6 lg:col-span-1">
                                {/* Statistik Populasi */}
                                <div className="bg-white p-4 rounded-xl shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistik Populasi</h3>

                                    <div className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-blue-600 font-medium">Laki-laki</span>
                                            <span className="text-gray-700">
                                                {stats.laki_laki} ({persentaseLaki}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${persentaseLaki}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-pink-600 font-medium">Perempuan</span>
                                            <span className="text-gray-700">
                                                {stats.perempuan} ({persentasePerempuan}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-pink-500 h-2 rounded-full"
                                                style={{ width: `${persentasePerempuan}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Aksi Cepat */}
                                <div className="bg-white p-4 rounded-xl shadow-md">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
                                    <div className="flex flex-col gap-3">
                                        <button className="bg-blue-500/20 text-blue-700 hover:bg-blue-500 hover:text-white px-4 py-2 rounded-md transition font-medium">
                                            Tambah Berita Baru
                                        </button>
                                        <button className="bg-yellow-400/20 text-yellow-700 hover:bg-yellow-500 hover:text-white px-4 py-2 rounded-md transition font-medium">
                                            Tambah Pengumuman
                                        </button>
                                        <button className="bg-green-500/20 text-green-700 hover:bg-green-600 hover:text-white px-4 py-2 rounded-md transition font-medium">
                                            Tambah Produk Desa
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Kolom kanan */}
                            <div className="bg-white p-4 rounded-xl shadow-md lg:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
                                <p className="text-sm text-gray-500">Belum ada aktivitas terbaru yang ditampilkan.</p>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    )
}
