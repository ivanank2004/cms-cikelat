'use client'

import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Info,
    BarChart3,
    Newspaper,
    Megaphone,
    ShoppingBag,
    LogOut,
} from 'lucide-react'

export default function Sidebar() {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'POST',
                cache: 'no-store', // pastikan tidak cached
            })

            // Pakai reload untuk memastikan middleware tidak baca cookie lama
            window.location.href = '/'
        } catch (err) {
            console.error('Gagal logout:', err)
            alert('Terjadi kesalahan saat logout.')
        }
    }

    const navItems = [
        { label: 'Dashboard Utama', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: 'Profil Desa', path: '/dashboard/profil', icon: <Info className="w-4 h-4" /> },
        { label: 'Infografis', path: '/dashboard/infografis', icon: <BarChart3 className="w-4 h-4" /> },
        { label: 'Berita', path: '/dashboard/berita', icon: <Newspaper className="w-4 h-4" /> },
        { label: 'Pengumuman', path: '/dashboard/pengumuman', icon: <Megaphone className="w-4 h-4" /> },
        { label: 'Belanja', path: '/dashboard/belanja', icon: <ShoppingBag className="w-4 h-4" /> },
    ]

    return (
        <div className="w-64 h-screen bg-white shadow-md flex flex-col justify-between">
            {/* Bagian atas berwarna */}
            <div className="bg-[#129990] text-white px-4 py-4">
                <div className="flex items-center gap-3">
                    <Image src="/img/sukabumi.png" alt="Logo" width={40} height={40} />
                    <div>
                        <p className="font-bold leading-5">Desa Cikelat</p>
                        <p className="text-xs">Dashboard CMS</p>
                    </div>
                </div>
            </div>

            {/* Garis pemisah */}
            <hr className="border-gray-300" />

            {/* Navigasi */}
            <div className="flex-1 px-4 py-4">
                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${pathname === item.path
                                ? 'bg-[#129990] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Logout di bagian bawah */}
            <div className="px-4 pb-4">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-md text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    )
}