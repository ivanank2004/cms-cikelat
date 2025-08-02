'use client'

import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/Header'
import { useState, useEffect } from 'react'
import { Eye, Target } from 'lucide-react'
import EditKepalaDesaModal from '@/component/KepalaDesaModal'

export default function ProfilDesaPage() {
    const [activeTab, setActiveTab] = useState('kepala')
    const [profilData, setProfilData] = useState(null)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [formData, setFormData] = useState({
        nama_kepala_desa: '',
        jabatan_kepala_desa: '',
        sambutan: '',
        foto_kades: '',
    })

    const tabs = [
        { key: 'kepala', label: 'Kepala Desa' },
        { key: 'visi', label: 'Visi & Misi' },
        { key: 'sejarah', label: 'Sejarah Desa' },
        { key: 'struktur', label: 'Struktur Organisasi' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/profil')
                const data = await res.json()
                setProfilData(data)
            } catch (err) {
                console.error('Gagal mengambil data profil:', err)
            }
        }

        fetchData()
    }, [])

    function handleSubmit() {
        // sementara belum connect backend
        console.log('Submit form data:', formData)
        setEditModalOpen(false)
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1">
                <DashboardHeader title="Profil Desa" />

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
                            {!profilData ? (
                                <p>Memuat data...</p>
                            ) : (
                                <>
                                    {activeTab === 'kepala' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-800">Informasi Kepala Desa</h3>
                                                <button
                                                    onClick={() => {
                                                        setFormData({
                                                            nama_kepala_desa: profilData.nama_kepala_desa || '',
                                                            jabatan_kepala_desa: profilData.jabatan_kepala_desa || '',
                                                            sambutan: profilData.sambutan || '',
                                                            foto_kades: profilData.foto_kades || '',
                                                        })
                                                        setEditModalOpen(true)
                                                    }}
                                                    className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium">
                                                    Edit Data
                                                </button>
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                                                <div className="w-full md:w-56 flex-shrink-0">
                                                    <div className="w-56 h-56 rounded-full overflow-hidden shadow-md">
                                                        <img
                                                            src={profilData.foto_kades || '/img/kepala-desa.jpg'}
                                                            alt="Kepala Desa"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between text-sm text-gray-700 rounded-xl p-4 bg-white">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-gray-800">
                                                            {profilData.nama_kepala_desa || 'Nama Kepala Desa'}
                                                        </h3>
                                                        <p className="text-gray-600 mb-4">
                                                            {profilData.jabatan_kepala_desa || 'Jabatan'}
                                                        </p>
                                                        <p className="mb-4">
                                                            {profilData.sambutan || 'Sambutan belum tersedia.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <EditKepalaDesaModal
                                                isOpen={editModalOpen}
                                                onClose={() => setEditModalOpen(false)}
                                                formData={formData}
                                                setFormData={setFormData}
                                                onSubmit={handleSubmit}
                                            />
                                        </div>
                                    )}

                                    {activeTab === 'visi' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-800">Visi & Misi Desa</h3>
                                                <button className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium">
                                                    Edit Data
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Eye className="w-6 h-6 text-blue-600" />
                                                        <h4 className="text-blue-800 font-semibold text-lg">Visi</h4>
                                                    </div>
                                                    <p className="text-sm text-blue-900">
                                                        {profilData.visi || 'Visi belum tersedia.'}
                                                    </p>
                                                </div>

                                                <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Target className="w-6 h-6 text-green-600" />
                                                        <h4 className="text-green-800 font-semibold text-lg">Misi</h4>
                                                    </div>
                                                    <ul className="list-disc list-inside text-sm text-green-900 space-y-1">
                                                        {(profilData.misi || '')
                                                            .split('\n')
                                                            .map((item, index) => (
                                                                <li key={index}>{item}</li>
                                                            ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'sejarah' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-800">Sejarah Desa</h3>
                                                <button className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium">
                                                    Edit Data
                                                </button>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm max-w-4xl text-justify">
                                                <p className="text-[15px] text-amber-900 leading-relaxed">
                                                    {profilData.sejarah || 'Sejarah belum tersedia.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'struktur' && (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-800">Struktur Organisasi</h3>
                                                <button className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium">
                                                    Edit Data
                                                </button>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                                <div className="w-full md:w-2/3">
                                                    <button
                                                        onClick={() => document.getElementById('modal-struktur').showModal()}
                                                        className="cursor-pointer border rounded-md overflow-hidden shadow hover:shadow-lg transition"
                                                    >
                                                        <img
                                                            src={profilData.struktur_organisasi || '/img/struktur-organisasi.jpg'}
                                                            alt="Struktur Organisasi"
                                                            className="w-full object-cover"
                                                        />
                                                    </button>
                                                </div>

                                                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm text-sm text-gray-800">
                                                    <h4 className="text-lg font-semibold mb-2">
                                                        {profilData.nama_organisasi || 'Pemerintahan Desa Cikelat'}
                                                    </h4>
                                                    <p className="text-gray-600 mb-1">Struktur Organisasi</p>
                                                    <p className="text-gray-700 font-medium">
                                                        {profilData.periode_struktur || 'Periode belum tersedia'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Modal Gambar Besar */}
                                            <dialog id="modal-struktur" className="modal">
                                                <form method="dialog" className="modal-box max-w-4xl bg-white">
                                                    <img
                                                        src={profilData.struktur_organisasi || '/img/struktur-organisasi.jpg'}
                                                        alt="Struktur Organisasi"
                                                        className="w-full h-auto object-contain rounded-md"
                                                    />
                                                    <div className="text-right mt-4">
                                                        <button className="px-4 py-2 bg-[#129990] text-white rounded-md hover:bg-[#107c77] transition">
                                                            Tutup
                                                        </button>
                                                    </div>
                                                </form>
                                                <div className="modal-backdrop">
                                                    <form method="dialog">
                                                        <button>Close</button>
                                                    </form>
                                                </div>
                                            </dialog>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
