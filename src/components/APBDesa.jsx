'use client'

import { useEffect, useState } from 'react'
import EditAPBDesaModal from './APBDesaModal'
import { Loader2 } from 'lucide-react'

export default function KomponenAPBDesa() {
  const [apbdesData, setApbdesData] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [formData, setFormData] = useState([])
  const [originalFormData, setOriginalFormData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const res = await fetch('/api/apbdes')
        const data = await res.json()
        setApbdesData(data)
        setFormData(data)
      } catch (err) {
        console.error('Gagal fetch data APBDes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const pendapatanData = apbdesData.map(({ tahun, pendapatan }) => ({ tahun, jumlah: pendapatan }))
  const belanjaData = apbdesData.map(({ tahun, belanja }) => ({ tahun, jumlah: belanja }))

  const formatRupiah = (angka) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka)

  const totalPendapatan = pendapatanData.reduce((sum, d) => sum + d.jumlah, 0)
  const totalBelanja = belanjaData.reduce((sum, d) => sum + d.jumlah, 0)

  return (
    <div className="flex flex-col gap-6 min-h-[200px]">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[200px] gap-2 text-gray-500">
          <Loader2 className="animate-spin w-8 h-8" />
          <p className="text-sm font-medium">Memuat Data...</p>
        </div>
      ) : (
        <>
          {/* Header + Tombol Edit */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Anggaran Pendapatan & Belanja Desa
            </h3>
            <button
              onClick={() => {
                setOriginalFormData(formData)
                setEditModalOpen(true)
              }}
              className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium"
            >
              Edit Data
            </button>
          </div>

          {/* Dua Card Bersebelahan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pendapatan */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
              <h4 className="text-base font-semibold text-gray-700 mb-4">Pendapatan</h4>
              <div className="space-y-2">
                {pendapatanData.map((item) => (
                  <div
                    key={item.tahun}
                    className="flex justify-between text-sm text-gray-800 border-b py-2"
                  >
                    <span>{item.tahun}</span>
                    <span>{formatRupiah(item.jumlah)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm font-medium text-right text-green-700">
                Total: {formatRupiah(totalPendapatan)}
              </div>
            </div>

            {/* Belanja */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
              <h4 className="text-base font-semibold text-gray-700 mb-4">Belanja</h4>
              <div className="space-y-2">
                {belanjaData.map((item) => (
                  <div
                    key={item.tahun}
                    className="flex justify-between text-sm text-gray-800 border-b py-2"
                  >
                    <span>{item.tahun}</span>
                    <span>{formatRupiah(item.jumlah)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm font-medium text-right text-red-700">
                Total: {formatRupiah(totalBelanja)}
              </div>
            </div>
          </div>

          <EditAPBDesaModal
            isOpen={editModalOpen}
            onClose={() => {
              setFormData(originalFormData)
              setEditModalOpen(false)
            }}
            formData={formData}
            setFormData={setFormData}
            onSubmit={async () => {
              await fetch('/api/apbdes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
              })
              setEditModalOpen(false)
              const res = await fetch('/api/apbdes')
              const data = await res.json()
              setApbdesData(data)
              setFormData(data)
            }}
          />
        </>
      )}
    </div>
  )
}
