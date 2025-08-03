import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// GET: ambil data infografis
export async function GET() {
  try {
    const statistikRes = await pool.query('SELECT * FROM statistik_penduduk ORDER BY id DESC LIMIT 1')
    const statistik = statistikRes.rows[0]

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

// PUT: update data
export async function PUT(req) {
  try {
    const body = await req.json()
    const client = await pool.connect()

    const {
      statistik,
      kelompok_umur,
      dusun,
      pendidikan_terakhir,
      pekerjaan,
      status_perkawinan,
      agama,
    } = body

    // Mulai transaksi
    await client.query('BEGIN')

    // Update statistik_penduduk (hanya 1 baris, ambil id terakhir)
    if (statistik) {
      await client.query(
        `UPDATE statistik_penduduk SET jumlah_penduduk = $1, jumlah_kk = $2, laki_laki = $3, perempuan = $4
         WHERE id = (SELECT id FROM statistik_penduduk ORDER BY id DESC LIMIT 1)`,
        [
          statistik.jumlah_penduduk,
          statistik.jumlah_kk,
          statistik.laki_laki,
          statistik.perempuan,
        ]
      )
    }

    // Helper: update table dinamis berdasarkan kolom kunci
    async function updateTable(table, dataArray, keyName) {
      for (const item of dataArray) {
        await client.query(
          `UPDATE ${table} SET jumlah = $1 WHERE ${keyName} = $2`,
          [item.jumlah, item[keyName]]
        )
      }
    }

    // Update semua tabel lanjutan
    if (kelompok_umur) await updateTable('kelompok_umur', kelompok_umur, 'rentang_umur')
    if (dusun) await updateTable('dusun', dusun, 'nama_dusun')
    if (pendidikan_terakhir) await updateTable('pendidikan_terakhir', pendidikan_terakhir, 'jenjang')
    if (pekerjaan) await updateTable('pekerjaan', pekerjaan, 'pekerjaan')
    if (status_perkawinan) await updateTable('status_perkawinan', status_perkawinan, 'status')
    if (agama) await updateTable('agama', agama, 'nama')

    // Commit transaksi
    await client.query('COMMIT')
    client.release()

    return NextResponse.json({ message: 'Data berhasil diperbarui' })
  } catch (error) {
    console.error('Error updating statistik:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
