import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    // Ambil statistik utama
    const statistikRes = await pool.query('SELECT * FROM statistik_penduduk ORDER BY id DESC LIMIT 1')
    const statistik = statistikRes.rows[0]

    // Ambil data lanjutan
    const kelompokUmur = await pool.query('SELECT rentang_umur, jumlah FROM kelompok_umur')
    const dusun = await pool.query('SELECT nama_dusun, jumlah FROM dusun')
    const pendidikan = await pool.query('SELECT jenjang, jumlah FROM pendidikan_terakhir')
    const pekerjaan = await pool.query('SELECT pekerjaan, jumlah FROM pekerjaan')
    const perkawinan = await pool.query('SELECT status, jumlah FROM status_perkawinan')
    const agama = await pool.query('SELECT nama, jumlah FROM agama')

    return NextResponse.json({
      statistik,
      kelompok_umur: kelompokUmur.rows,
      dusun: dusun.rows,
      pendidikan_terakhir: pendidikan.rows,
      pekerjaan: pekerjaan.rows,
      status_perkawinan: perkawinan.rows,
      agama: agama.rows,
    })
  } catch (error) {
    console.error('Error fetching statistik:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
