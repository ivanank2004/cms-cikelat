'use client'

import { useState, useEffect } from 'react'

export default function EditStrukturModal({ isOpen, onClose, formData, setFormData, onSubmit }) {
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (formData.struktur_organisasi && !(formData.struktur_organisasi instanceof File)) {
      setPreviewUrl(formData.struktur_organisasi)
    }
  }, [formData.struktur_organisasi])

  function handleChange(e) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, struktur_organisasi: file }))
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl mx-4">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Struktur Organisasi</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="nama_organisasi">
              Nama Organisasi
            </label>
            <input
              type="text"
              id="nama_organisasi"
              name="nama_organisasi"
              value={formData.nama_organisasi || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="periode_struktur">
              Periode
            </label>
            <input
              type="text"
              id="periode_struktur"
              name="periode_struktur"
              value={formData.periode_struktur || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="struktur_organisasi">
              Gambar Struktur Organisasi
            </label>
            <input
              type="file"
              id="struktur_organisasi"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#129990]/20 file:text-[#129990] file:cursor-pointer"
            />

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview Struktur Organisasi"
                className="mt-4 w-full max-h-64 object-contain rounded border"
              />
            )}
          </div>

          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-[#129990] text-white hover:bg-[#107c77] transition"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
