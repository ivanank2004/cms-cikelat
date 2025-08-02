import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import { supabase } from '@/lib/supabaseClient'
import { getImageUrl } from '@/lib/getImageURL'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

// GET - Ambil semua berita
export async function GET() {
  try {
    const client = await pool.connect()
    const result = await client.query('SELECT * FROM berita ORDER BY tanggal DESC')
    client.release()
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Gagal mengambil data berita' }, { status: 500 })
  }
}

// POST - Tambah atau update berita
export async function POST(req) {
  try {
    const formData = await req.formData()
    const id = formData.get('id')
    const judul = formData.get('judul')
    const tanggal = formData.get('tanggal')
    const sumber = formData.get('sumber')
    const isi = formData.get('isi')
    const gambarFile = formData.get('gambar') // bisa File atau null

    let gambarUrl = null

    // Upload gambar ke Supabase jika ada file
    if (gambarFile && typeof gambarFile === 'object') {
      const fileExt = gambarFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `berita/${fileName}`

      const { error } = await supabase.storage
        .from('cms-desa-cikelat')
        .upload(filePath, gambarFile)

      if (error) throw error

      gambarUrl = getImageUrl(filePath)
    }

    const client = await pool.connect()

    let result
    if (id) {
      // Update
      const query = `
        UPDATE berita
        SET judul = $1,
            tanggal = $2,
            gambar = COALESCE($3, gambar),
            sumber = $4,
            isi = $5
        WHERE id = $6
        RETURNING *
      `
      const values = [judul, tanggal, gambarUrl, sumber, isi, id]
      result = await client.query(query, values)
    } else {
      // Insert
      const query = `
        INSERT INTO berita (judul, tanggal, gambar, sumber, isi)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `
      const values = [judul, tanggal, gambarUrl, sumber, isi]
      result = await client.query(query, values)
    }

    client.release()
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json({ error: 'Gagal menyimpan data berita' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(req) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID tidak ditemukan' }, { status: 400 })
    }

    const client = await pool.connect()
    await client.query('DELETE FROM berita WHERE id = $1', [id])
    client.release()

    return NextResponse.json({ message: 'Berita berhasil dihapus' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Gagal menghapus berita' }, { status: 500 })
  }
}
