"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                const data = await res.json();
                setError(data.message || "Login gagal");
            }
        } catch (err) {
            setError("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#129990]">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                <img
                    src="/img/sukabumi.png"
                    alt="Logo Sukabumi"
                    className="mx-auto h-20 w-auto mb-4"
                />
                <h1 className="text-xl font-bold text-gray-800">
                    Desa Cikelat
                </h1>
                <p className="text-gray-500 mb-6">
                    Dashboard Admin Website Desa Cikelat
                </p>

                <form onSubmit={handleSubmit} className="text-left space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 px-4 py-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-[#129990]"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-[#129990] text-white py-2 rounded-md hover:bg-[#096B68] hover:cursor-pointer transition flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin mr-2"
                                />
                                Memproses...
                            </>
                        ) : (
                            "Masuk"
                        )}
                    </button>
                </form>

                <p className="text-xs text-gray-500 mt-6">
                    © 2025 KKN 23 Nusa Putra & KKN-T 06 IPB, Desa Cikelat
                    <br />
                    All rights reserved.
                </p>
            </div>
        </div>
    );
}
