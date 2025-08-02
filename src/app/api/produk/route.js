import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// GET: Ambil semua produk
export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM produk ORDER BY id DESC')
    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data produk' }, { status: 500 })
  }
}

// POST: Tambah produk baru
export async function POST(req) {
  try {
    const { nama, harga, gambar, kontak, deskripsi } = await req.json()
    const query = `
      INSERT INTO produk (nama, harga, gambar, kontak, deskripsi)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `
    const values = [nama, harga, gambar, kontak, deskripsi]
    const { rows } = await pool.query(query, values)
    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menambahkan produk' }, { status: 500 })
  }
}

// PUT: Update produk
export async function PUT(req) {
  try {
    const { id, nama, harga, gambar, kontak, deskripsi } = await req.json()
    const query = `
      UPDATE produk
      SET nama = $1, harga = $2, gambar = $3, kontak = $4, deskripsi = $5
      WHERE id = $6 RETURNING *
    `
    const values = [nama, harga, gambar, kontak, deskripsi, id]
    const { rows } = await pool.query(query, values)
    return NextResponse.json(rows[0])
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memperbarui produk' }, { status: 500 })
  }
}

// DELETE: Hapus produk berdasarkan ID (ambil ID dari query param)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    await pool.query('DELETE FROM produk WHERE id = $1', [id])
    return NextResponse.json({ message: 'Produk berhasil dihapus' })
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menghapus produk' }, { status: 500 })
  }
}
