'use client'

import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/Header'
import { useEffect, useState } from 'react'
import StatistikLanjutan from '@/components/StatistikLanjutan'
import KomponenAPBDesa from '@/components/APBDesa'
import KomponenBansos from '@/components/Bansos'
import EditStatistikModal from '@/components/StatistikModal'

export default function InfografisPage() {
    const [activeTab, setActiveTab] = useState('statistik')
    const [statistik, setStatistik] = useState({
        jumlah_penduduk: 0,
        jumlah_kk: 0,
        laki_laki: 0,
        perempuan: 0,
        kelompok_umur: [],
        dusun: [],
        pendidikan_terakhir: [],
        pekerjaan: [],
        status_perkawinan: [],
        agama: [],
    })

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [formData, setFormData] = useState(statistik)

    // 1. Pindahkan ke luar useEffect
    const fetchStatistik = async () => {
        const res = await fetch('/api/statistik')
        const data = await res.json()
        setStatistik({
            ...data.statistik,
            kelompok_umur: data.kelompok_umur,
            dusun: data.dusun,
            pendidikan_terakhir: data.pendidikan_terakhir,
            pekerjaan: data.pekerjaan,
            status_perkawinan: data.status_perkawinan,
            agama: data.agama,
        })
    }

    // 2. Panggil saat component pertama kali mount
    useEffect(() => {
        fetchStatistik()
    }, [])

    const tabs = [
        { key: 'statistik', label: 'Statistik Penduduk' },
        { key: 'apbdesa', label: 'APB Desa' },
        { key: 'bansos', label: 'Bantuan Sosial' },
    ]

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            <main className="flex-1">
                <DashboardHeader title="Infografis" />

                <div className="p-6">
                    <div className="bg-white shadow-md rounded-xl">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 py-3 text-sm font-medium transition ${activeTab === tab.key
                                        ? 'border-b-2 border-[#129990] text-[#129990]'
                                        : 'text-gray-600 hover:text-[#129990]'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="p-6 text-sm text-gray-700 min-h-[200px]">
                            {activeTab === 'statistik' && (
                                <div className="flex flex-col gap-4">
                                    {/* Header Section */}
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-800">Statistik Penduduk</h3>
                                        <button
                                            className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium"
                                            onClick={() => {
                                                setFormData(statistik)
                                                setEditModalOpen(true)
                                            }}
                                        >
                                            Edit Data
                                        </button>
                                    </div>

                                    {/* Card Statistik */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Jumlah Penduduk */}
                                        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                                            <p className="text-sm text-gray-500">Jumlah Penduduk</p>
                                            <h4 className="text-2xl font-bold text-green-600">{statistik.jumlah_penduduk}</h4>
                                        </div>

                                        {/* Jumlah Kepala Keluarga */}
                                        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-500">
                                            <p className="text-sm text-gray-500">Jumlah Kepala Keluarga</p>
                                            <h4 className="text-2xl font-bold text-amber-600">{statistik.jumlah_kk}</h4>
                                        </div>

                                        {/* Jumlah Laki-laki */}
                                        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                                            <p className="text-sm text-gray-500">Jumlah Laki-laki</p>
                                            <h4 className="text-2xl font-bold text-blue-600">{statistik.laki_laki}</h4>
                                        </div>

                                        {/* Jumlah Perempuan */}
                                        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-pink-500">
                                            <p className="text-sm text-gray-500">Jumlah Perempuan</p>
                                            <h4 className="text-2xl font-bold text-pink-600">{statistik.perempuan}</h4>
                                        </div>
                                    </div>
                                    <StatistikLanjutan data={statistik} />
                                    <EditStatistikModal
                                        isOpen={editModalOpen}
                                        onClose={() => setEditModalOpen(false)}
                                        formData={formData}
                                        setFormData={setFormData}
                                        onSubmit={async () => {
                                            await fetch('/api/statistik', {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    statistik: {
                                                        jumlah_penduduk: formData.jumlah_penduduk,
                                                        jumlah_kk: formData.jumlah_kk,
                                                        laki_laki: formData.laki_laki,
                                                        perempuan: formData.perempuan,
                                                    },
                                                    kelompok_umur: formData.kelompok_umur,
                                                    dusun: formData.dusun,
                                                    pendidikan_terakhir: formData.pendidikan_terakhir,
                                                    pekerjaan: formData.pekerjaan,
                                                    status_perkawinan: formData.status_perkawinan,
                                                    agama: formData.agama,
                                                }),
                                            })

                                            await fetchStatistik()
                                            setEditModalOpen(false)
                                        }}
                                    />
                                </div>
                            )}
                            {activeTab === 'apbdesa' && (<KomponenAPBDesa />)}
                            {activeTab === 'bansos' && (
                                <KomponenBansos />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}