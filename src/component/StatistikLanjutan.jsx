'use client'
import { useEffect, useState } from 'react'

export default function StatistikLanjutan() {
    const [expanded, setExpanded] = useState(null)
    const [dataSections, setDataSections] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/statistik')
                const data = await res.json()

                const format = (array, labelKey, jumlahKey, suffix = 'orang') =>
                    array.map(item => `${item[labelKey]} — ${item[jumlahKey]} ${suffix}`)

                const sections = [
                    {
                        key: 'umur',
                        title: 'Kelompok Umur',
                        items: format(data.kelompok_umur, 'rentang_umur', 'jumlah'),
                    },
                    {
                        key: 'dusun',
                        title: 'Distribusi per Dusun',
                        items: format(data.dusun, 'nama_dusun', 'jumlah'),
                    },
                    {
                        key: 'pendidikan',
                        title: 'Pendidikan Terakhir',
                        items: format(data.pendidikan_terakhir, 'jenjang', 'jumlah'),
                    },
                    {
                        key: 'pekerjaan',
                        title: 'Pekerjaan',
                        items: format(data.pekerjaan, 'pekerjaan', 'jumlah'),
                    },
                    {
                        key: 'perkawinan',
                        title: 'Status Perkawinan',
                        items: format(data.status_perkawinan, 'status', 'jumlah'),
                    },
                    {
                        key: 'agama',
                        title: 'Agama',
                        items: format(data.agama, 'nama', 'jumlah'),
                    },
                ]

                setDataSections(sections)
            } catch (err) {
                console.error('Gagal memuat data statistik lanjutan:', err)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dataSections.map((section) => {
                const showAll = expanded === section.key
                const visibleItems = showAll ? section.items : section.items.slice(0, 3)

                return (
                    <div key={section.key} className="bg-white rounded-xl shadow-sm p-3 border border-gray-200 flex flex-col justify-between">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">{section.title}</h4>
                            <ul
                                className={`text-sm text-gray-700 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${showAll ? 'max-h-[500px]' : 'max-h-[100px]'}`}
                            >
                                {visibleItems.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        {section.items.length > 3 && (
                            <div className="pt-3 text-right">
                                <button
                                    className="text-xs text-[#129990] hover:underline"
                                    onClick={() => setExpanded(showAll ? null : section.key)}
                                >
                                    {showAll ? 'Tampilkan lebih sedikit' : 'Lihat lebih lengkap'}
                                </button>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
