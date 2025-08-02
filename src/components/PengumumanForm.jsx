'use client'

import { useState, useEffect } from 'react'

export default function PengumumanForm({ initialData = null, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    judul: '',
    isi: '',
    tanggal: ''
  })

  useEffect(() => {
    if (initialData) {
      const date = new Date(initialData.tanggal)

      // Ambil tahun, bulan, tanggal dari waktu lokal
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      const formattedDate = `${year}-${month}-${day}`

      setForm({
        ...initialData,
        tanggal: formattedDate,
      })
    }
  }, [initialData])


  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Judul</label>
        <input
          type="text"
          name="judul"
          value={form.judul}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Isi</label>
        <textarea
          name="isi"
          value={form.isi}
          onChange={handleChange}
          rows="5"
          className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Tanggal</label>
        <input
          type="date"
          name="tanggal"
          value={form.tanggal}
          onChange={handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-[#129990] rounded-md hover:bg-[#0f786d]"
        >
          Simpan
        </button>
      </div>
    </form>
  )
}
