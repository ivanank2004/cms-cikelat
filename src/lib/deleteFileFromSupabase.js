import { supabase } from "./supabaseClient";

/**
 * Menghapus file dari Supabase storage
 * @param {string} url - URL lengkap file yang akan dihapus
 * @returns {Promise<boolean>} - Status keberhasilan penghapusan
 */
export async function deleteFileFromStorage(url) {
    if (!url) return false;

    try {
        // Ekstrak path dari URL
        // Format URL biasanya: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path/to/file
        const urlParts = url.split("/");
        const bucketIndex = urlParts.findIndex((part) => part === "public") + 1;

        if (bucketIndex > 0 && bucketIndex < urlParts.length) {
            const bucket = urlParts[bucketIndex];
            const path = urlParts.slice(bucketIndex + 1).join("/");

            // Hapus file dari storage
            const { error } = await supabase.storage
                .from(bucket)
                .remove([path]);

            if (error) {
                console.error("Error deleting file:", error);
                return false;
            }

            return true;
        }

        return false;
    } catch (error) {
        console.error("Error parsing file URL:", error);
        return false;
    }
}

/**
 * Ekstrak path file dari URL Supabase
 * @param {string} url - URL lengkap file
 * @returns {Object|null} - Informasi bucket dan path, atau null jika gagal
 */
export function extractPathFromUrl(url) {
    if (!url) return null;

    try {
        // Ekstrak path dari URL
        const urlParts = url.split("/");
        const bucketIndex = urlParts.findIndex((part) => part === "public") + 1;

        if (bucketIndex > 0 && bucketIndex < urlParts.length) {
            const bucket = urlParts[bucketIndex];
            const path = urlParts.slice(bucketIndex + 1).join("/");

            return { bucket, path };
        }

        return null;
    } catch (error) {
        console.error("Error parsing file URL:", error);
        return null;
    }
}
