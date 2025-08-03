import { useState, useEffect } from "react";

/**
 * Hook untuk mendeteksi perubahan form dan konfirmasi saat meninggalkan halaman
 * @param {any} initialData - Data awal form
 * @param {any} currentData - Data form saat ini
 * @returns {boolean} - Status apakah form telah berubah
 */
export default function useFormChanged(initialData, currentData) {
    const [isChanged, setIsChanged] = useState(false);

    // Deteksi perubahan pada form
    useEffect(() => {
        if (!initialData || !currentData) return;

        // Fungsi untuk membandingkan data
        const compareData = () => {
            // Ubah ke JSON string untuk perbandingan mudah
            const initialJson = JSON.stringify(initialData);
            const currentJson = JSON.stringify(currentData);

            return initialJson !== currentJson;
        };

        setIsChanged(compareData());
    }, [initialData, currentData]);

    // Tambahkan event listener untuk konfirmasi saat meninggalkan halaman
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!isChanged) return;

            // Standar pesan konfirmasi (browser akan menampilkan pesan default mereka)
            e.preventDefault();
            e.returnValue = "";
            return "";
        };

        if (isChanged) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isChanged]);

    return isChanged;
}
