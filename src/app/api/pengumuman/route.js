import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// GET: Ambil semua pengumuman
export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM pengumuman ORDER BY tanggal DESC')
    return NextResponse.json({ data: result.rows })
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

// POST: Tambah pengumuman baru
export async function POST(request) {
  try {
    const { judul, isi, tanggal } = await request.json()

    if (!judul || !isi || !tanggal) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 })
    }

    const result = await pool.query(
      'INSERT INTO pengumuman (judul, isi, tanggal) VALUES ($1, $2, $3) RETURNING *',
      [judul, isi, tanggal]
    )

    return NextResponse.json({ data: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Gagal menambahkan data' }, { status: 500 })
  }
}

// DELETE: Hapus pengumuman berdasarkan ID
export async function DELETE(request) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 })
    }

    const result = await pool.query('DELETE FROM pengumuman WHERE id = $1 RETURNING *', [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Pengumuman tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Pengumuman berhasil dihapus', data: result.rows[0] })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Gagal menghapus data' }, { status: 500 })
  }
}

// PUT: Update pengumuman berdasarkan ID
export async function PUT(request) {
  try {
    const { id, judul, isi, tanggal } = await request.json()

    if (!id || !judul || !isi || !tanggal) {
      return NextResponse.json({ error: 'Semua field harus diisi' }, { status: 400 })
    }

    const result = await pool.query(
      'UPDATE pengumuman SET judul = $1, isi = $2, tanggal = $3 WHERE id = $4 RETURNING *',
      [judul, isi, tanggal, id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Pengumuman tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Pengumuman berhasil diperbarui', data: result.rows[0] })
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Gagal memperbarui data' }, { status: 500 })
  }
}

