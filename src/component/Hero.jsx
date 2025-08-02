'use client'

import { useEffect, useState } from 'react'

export default function DashboardHero({ title = 'Dashboard Utama' }) {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="flex justify-between items-center bg-[#129990] text-white px-6 py-4 shadow-md">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm">Kelola konten website Desa Cikelat</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">Selamat datang, Admin</p>
        <p className="text-xs">{currentTime}</p>
      </div>
    </header>
  )
}
