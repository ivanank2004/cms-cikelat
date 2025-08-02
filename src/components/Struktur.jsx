'use client'

import { useEffect, useState } from 'react'

export default function TabStruktur() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/profil')
      const json = await res.json()
      setData(json)
    }
    fetchData()
  }, [])

  if (!data) {
    return <p className="p-4 text-sm text-gray-500">Memuat data...</p>
  }

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">Struktur Organisasi</h2>
      <img
        src={data.struktur_organisasi}
        alt="Struktur Organisasi"
        className="w-full max-w-3xl rounded-xl shadow-md border"
      />
    </div>
  )
}
