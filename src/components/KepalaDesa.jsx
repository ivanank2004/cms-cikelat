'use client'

import EditKepalaDesaModal from '../KepalaDesaModal'

export default function TabKepalaDesa({ profilData, formData, setFormData, onSubmit, modalOpen, setModalOpen }) {
    return (
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
                        setModalOpen(true)
                    }}
                    className="bg-[#129990]/20 text-[#129990] hover:bg-[#129990] hover:text-white px-4 py-2 rounded-md transition font-medium"
                >
                    Edit Data
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="w-full md:w-56 flex-shrink-0">
                    <div className="w-56 h-56 rounded-full overflow-hidden shadow-md">
                        <img
                            src={`${profilData.foto_kades || '/img/kepala-desa.jpg'}?t=${new Date().getTime()}`}
                            alt="Kepala Desa"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-between text-sm text-gray-700 rounded-xl p-4 bg-white">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{profilData.nama_kepala_desa}</h3>
                        <p className="text-gray-600 mb-4">{profilData.jabatan_kepala_desa}</p>
                        <p className="mb-4">{profilData.sambutan || 'Sambutan belum tersedia.'}</p>
                    </div>
                </div>
            </div>

            <EditKepalaDesaModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    )
}
