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
