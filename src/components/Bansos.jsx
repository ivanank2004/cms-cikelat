'use client'

import { useEffect, useState } from 'react'
import EditBansosModal from './BansosModal'
import { Loader2 } from 'lucide-react'

export default function KomponenBansos() {
    const [dataBansos, setDataBansos] = useState({
        bpjs_pbi: 0,
        pkh: 0,
        bpnt: 0,
        blt: 0,
    })
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/bansos')
                const data = await res.json()
                setDataBansos(data)
            } catch (err) {
                console.error('Gagal fetch data bansos:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const bantuanList = [
        { nama: 'BPJS PBI', jumlah: dataBansos.bpjs_pbi, warna: 'text-blue-600 border-blue-400' },
        { nama: 'PKH', jumlah: dataBansos.pkh, warna: 'text-green-600 border-green-400' },
        { nama: 'BPNT', jumlah: dataBansos.bpnt, warna: 'text-yellow-600 border-yellow-400' },
        { nama: 'BLT', jumlah: dataBansos.blt, warna: 'text-red-600 border-red-400' },
    ]

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Bantuan Sosial</h3>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium"
                >
                    Edit Data
                </button>
            </div>

            {/* Loading Spinner */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-[200px] gap-2 text-gray-500">
                    <Loader2 className="animate-spin w-8 h-8" />
                    <p className="text-sm font-medium">Memuat Data...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {bantuanList.map((item) => (
                        <div
                            key={item.nama}
                            className={`rounded-xl p-4 shadow-sm border-l-4 bg-white border ${item.warna}`}
                        >
                            <p className="text-sm text-gray-500">{item.nama}</p>
                            <h4 className="text-2xl font-bold">{item.jumlah.toLocaleString()} penerima</h4>
                        </div>
                    ))}
                </div>
            )}

            <EditBansosModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                formData={dataBansos}
                setFormData={setDataBansos}
                onSubmit={async () => {
                    await fetch('/api/bansos', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(dataBansos),
                    })
                    setModalOpen(false)
                }}
            />
        </div>
    )
}
