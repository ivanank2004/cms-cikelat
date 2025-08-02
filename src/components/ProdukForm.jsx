'use client'

import { useEffect, useState } from 'react'
import { uploadImage } from '@/lib/uploadImageToSupabase' // Pastikan path sesuai
import { getImageUrl } from '@/lib/getImageURL'

export default function ProdukForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nama: '',
    harga: '',
    kontak: '',
    gambar: '',
    deskripsi: '',
  })

  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (initialData) {
      setForm(initialData)
      setPreview(initialData.gambar || null)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const path = await uploadImage(file, 'produk')
      const publicUrl = getImageUrl(path)

      setForm((prev) => ({ ...prev, gambar: publicUrl }))
      setPreview(publicUrl)
    } catch (error) {
      alert('Gagal upload gambar.')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
      <div>
        <label className="block font-medium mb-1 text-gray-800">Nama Produk</label>
        <input
          type="text"
          name="nama"
          value={form.nama}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-gray-800"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-gray-800">Harga</label>
        <input
          type="number"
          name="harga"
          value={form.harga}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-gray-800"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-gray-800">Kontak</label>
        <input
          type="text"
          name="kontak"
          value={form.kontak}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-gray-800"
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-gray-800">Deskripsi</label>
        <textarea
          name="deskripsi"
          value={form.deskripsi}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-gray-800"
          rows="4"
        />
      </div>

      <div>
        <label className="block font-medium mb-1 text-gray-800">Gambar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block text-gray-800"
        />
        {uploading && <p className="text-sm text-gray-500">Mengupload...</p>}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded text-gray-800"
          />
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-[#129990] text-white rounded hover:bg-[#0f7f76]"
          disabled={uploading}
        >
          Simpan
        </button>
      </div>
    </form>
  )
}
