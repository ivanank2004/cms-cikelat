import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    // Ambil data bansos terbaru (misal berdasarkan id terbesar)
    const result = await pool.query('SELECT bpjs_pbi, pkh, bpnt, blt FROM bansos ORDER BY id DESC LIMIT 1')
    const data = result.rows[0]

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching bansos:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
