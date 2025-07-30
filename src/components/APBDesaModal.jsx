'use client'

import { useState } from 'react'

export default function EditAPBDesaModal({ isOpen, onClose, formData, setFormData, onSubmit }) {
    if (!isOpen) return null

    function handleChange(index, field, value) {
        const updated = [...formData]
        updated[index][field] = value === '' ? '' : Number(value)
        setFormData(updated)
    }

    function handleAddYear() {
        if (formData.length === 0) return

        const lastYear = Math.max(...formData.map((d) => d.tahun))
        const newEntry = {
            tahun: lastYear + 1,
            pendapatan: 0,
            belanja: 0,
        }
        setFormData([newEntry, ...formData])
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto relative">
                {/* Tombol Tutup */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    aria-label="Close"
                >
                    &times;
                </button>

                <h3 className="text-xl font-bold mb-6 text-gray-800">Edit APB Desa</h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmit()
                    }}
                    className="space-y-5"
                >
                    {/* Tombol Tambah Tahun - dipindahkan ke atas */}
                    <div className="mb-2 text-right">
                        <button
                            type="button"
                            onClick={handleAddYear}
                            className="text-sm text-[#129990] font-medium hover:underline"
                        >
                            + Tambah Tahun
                        </button>
                    </div>

                    {formData.map((item, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Tahun</label>
                                <input
                                    type="number"
                                    value={item.tahun}
                                    disabled
                                    className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Pendapatan</label>
                                <input
                                    type="number"
                                    value={item.pendapatan}
                                    onChange={(e) => handleChange(index, 'pendapatan', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Belanja</label>
                                <input
                                    type="number"
                                    value={item.belanja}
                                    onChange={(e) => handleChange(index, 'belanja', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Tombol Aksi */}
                    <div className="flex justify-end gap-2 mt-6">
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
