import { useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Hook untuk menghandle operasi API dengan penanganan loading dan error
 * @returns {Object} Fungsi dan state untuk operasi API
 */
export default function useApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fungsi untuk fetch data
     * @param {string} url - URL endpoint
     * @param {Object} options - Opsi fetch
     * @returns {Promise<any>} - Response data
     */
    const fetchData = useCallback(async (url, options = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message || "Terjadi kesalahan saat mengambil data");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    /**
     * Fungsi untuk POST/PUT data dengan toast notification
     * @param {string} url - URL endpoint
     * @param {Object} data - Data yang akan dikirim
     * @param {string} method - HTTP method (POST/PUT)
     * @param {string} loadingMessage - Pesan saat loading
     * @param {string} successMessage - Pesan saat sukses
     * @param {string} errorMessage - Pesan saat error
     * @returns {Promise<any>} - Response data
     */
    const mutateData = useCallback(
        async (
            url,
            data,
            method = "POST",
            loadingMessage = "Menyimpan data...",
            successMessage = "Data berhasil disimpan",
            errorMessage = "Gagal menyimpan data"
        ) => {
            setIsLoading(true);
            setError(null);

            const toastId = toast.loading(loadingMessage);

            try {
                const options = {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                };

                const response = await fetch(url, options);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.error || `Error: ${response.status}`
                    );
                }

                const responseData = await response.json();
                toast.success(successMessage, { id: toastId });
                return responseData;
            } catch (err) {
                setError(err.message || "Terjadi kesalahan");
                toast.error(errorMessage, { id: toastId });
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    /**
     * Fungsi untuk menghapus data dengan konfirmasi
     * @param {string} url - URL endpoint
     * @param {Object} data - Data untuk request body
     * @param {string} loadingMessage - Pesan saat loading
     * @param {string} successMessage - Pesan saat sukses
     * @param {string} errorMessage - Pesan saat error
     * @returns {Promise<any>} - Response data
     */
    const deleteData = useCallback(
        async (
            url,
            data,
            loadingMessage = "Menghapus data...",
            successMessage = "Data berhasil dihapus",
            errorMessage = "Gagal menghapus data"
        ) => {
            setIsLoading(true);
            setError(null);

            const toastId = toast.loading(loadingMessage);

            try {
                const options = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                };

                const response = await fetch(url, options);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(
                        errorData.error || `Error: ${response.status}`
                    );
                }

                const responseData = await response.json();
                toast.success(successMessage, { id: toastId });
                return responseData;
            } catch (err) {
                setError(err.message || "Terjadi kesalahan");
                toast.error(errorMessage, { id: toastId });
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {
        isLoading,
        error,
        fetchData,
        mutateData,
        deleteData,
    };
}
