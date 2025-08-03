"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/Header";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function PengaturanPage() {
    const [passwords, setPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [show, setShow] = useState({
        old: false,
        new: false,
        confirm: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", content: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", content: "" });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({
                type: "error",
                content: "Password baru tidak cocok.",
            });
            return;
        }
        if (passwords.newPassword.length < 6) {
            setMessage({
                type: "error",
                content: "Password baru minimal harus 6 karakter.",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldPassword: passwords.oldPassword,
                    newPassword: passwords.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Terjadi kesalahan");
            }

            setMessage({
                type: "success",
                content: "Password berhasil diubah!",
            });
            setPasswords({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            }); // Reset form
        } catch (error) {
            setMessage({ type: "error", content: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 ml-64">
            <Sidebar />
            <main className="flex-1">
                <DashboardHeader title="Pengaturan Akun" />
                <div className="p-6">
                    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Ubah Password
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    Password Lama
                                </label>
                                <div className="relative">
                                    <input
                                        type={show.old ? "text" : "password"}
                                        name="oldPassword"
                                        value={passwords.oldPassword}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#129990]"
                                        onClick={() =>
                                            setShow((prev) => ({
                                                ...prev,
                                                old: !prev.old,
                                            }))
                                        }
                                        tabIndex={-1}
                                    >
                                        {show.old ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={show.new ? "text" : "password"}
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#129990]"
                                        onClick={() =>
                                            setShow((prev) => ({
                                                ...prev,
                                                new: !prev.new,
                                            }))
                                        }
                                        tabIndex={-1}
                                    >
                                        {show.new ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-800">
                                    Konfirmasi Password Baru
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            show.confirm ? "text" : "password"
                                        }
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 w-full border rounded px-3 py-2 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#129990]"
                                        onClick={() =>
                                            setShow((prev) => ({
                                                ...prev,
                                                confirm: !prev.confirm,
                                            }))
                                        }
                                        tabIndex={-1}
                                    >
                                        {show.confirm ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {message.content && (
                                <div
                                    className={`p-3 rounded-md text-sm ${
                                        message.type === "error"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"
                                    }`}
                                >
                                    {message.content}
                                </div>
                            )}

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 px-4 py-2 rounded bg-[#129990] text-white hover:bg-[#0f7f7a] disabled:bg-gray-400"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : null}
                                    {loading
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
