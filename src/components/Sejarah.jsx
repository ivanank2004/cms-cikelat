"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function TabSejarah() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const toastId = toast.loading("Memuat data sejarah desa...");
            try {
                const res = await fetch("/api/profil");
                if (!res.ok) throw new Error("Gagal memuat data");
                const json = await res.json();
                setData(json);
                toast.success("Data sejarah desa berhasil dimuat", {
                    id: toastId,
                });
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Gagal memuat data sejarah desa", { id: toastId });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return <p className="p-4 text-sm text-gray-500">Memuat data...</p>;
    }

    if (!data) {
        return <p className="p-4 text-sm text-gray-500">Data tidak tersedia</p>;
    }

    return (
        <div className="p-4 space-y-2">
            <h2 className="text-lg font-semibold">Sejarah Desa</h2>
            <p className="text-gray-700 whitespace-pre-line">{data.sejarah}</p>
        </div>
    );
}
