import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM profil_desa LIMIT 1')
    const profil = result.rows[0]

    if (!profil) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json(profil)
  } catch (error) {
    console.error('Error fetching profil desa:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()

    const allowedFields = [
      'nama_kepala_desa',
      'jabatan_kepala_desa',
      'sambutan',
      'foto_kades',
      'visi',
      'misi',
      'sejarah',
      'struktur_organisasi',
      'nama_organisasi',
      'periode_struktur',
    ]

    // Filter hanya kolom yang diizinkan
    const fields = Object.entries(body).filter(([key]) => allowedFields.includes(key))

    if (fields.length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang dikirim' }, { status: 400 })
    }

    const setClause = fields.map(([key], i) => `${key} = $${i + 1}`).join(', ')
    const values = fields.map(([, value]) => value)

    const query = `UPDATE profil_desa SET ${setClause} WHERE id = 1`

    await pool.query(query, values)

    return NextResponse.json({ message: 'Profil berhasil diperbarui' })
  } catch (error) {
    console.error('Error updating profil desa:', error)
    return NextResponse.json({ error: 'Gagal memperbarui data' }, { status: 500 })
  }
}


