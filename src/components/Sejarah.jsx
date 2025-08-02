'use client'

import { useEffect, useState } from 'react'

export default function TabSejarah() {
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
      <h2 className="text-lg font-semibold">Sejarah Desa</h2>
      <p className="text-gray-700 whitespace-pre-line">{data.sejarah}</p>
    </div>
  )
}
