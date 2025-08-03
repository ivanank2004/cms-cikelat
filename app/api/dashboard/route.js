import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

export async function GET() {
    try {
        const beritaResult = await pool.query('SELECT COUNT(*) FROM berita')
        const totalBerita = parseInt(beritaResult.rows[0].count)

        const pengumumanResult = await pool.query('SELECT COUNT(*) FROM pengumuman')
        const totalPengumuman = parseInt(pengumumanResult.rows[0].count)

        const produkResult = await pool.query('SELECT COUNT(*) FROM produk')
        const totalProduk = parseInt(produkResult.rows[0].count)

        const pendudukResult = await pool.query(
            'SELECT jumlah_penduduk, laki_laki, perempuan FROM statistik_penduduk ORDER BY tanggal_update DESC LIMIT 1'
        )

        const stat = pendudukResult.rows[0] || {
            jumlah_penduduk: 0,
            laki_laki: 0,
            perempuan: 0,
        }

        return NextResponse.json({
            berita: totalBerita,
            pengumuman: totalPengumuman,
            produk: totalProduk,
            penduduk: stat.jumlah_penduduk,
            laki_laki: stat.laki_laki,
            perempuan: stat.perempuan,
        })
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
