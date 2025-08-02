import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function GET() {
  try {
    const result = await pool.query('SELECT tahun, pendapatan, belanja FROM apbdes ORDER BY tahun DESC')
    const data = result.rows.map(row => ({
      tahun: row.tahun,
      pendapatan: Number(row.pendapatan.replace(/[^0-9]/g, '')) || 0,
      belanja: Number(row.belanja.replace(/[^0-9]/g, '')) || 0,
    }))
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching APBDes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const apbdesData = await request.json()
    // apbdesData diasumsikan array objek {tahun, pendapatan, belanja}

    // Mulai transaksi
    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      // Hapus semua data lama (opsional, sesuaikan kebutuhan)
      await client.query('DELETE FROM apbdes')

      // Insert ulang data terbaru satu per satu
      const insertText = 'INSERT INTO apbdes (tahun, pendapatan, belanja) VALUES ($1, $2, $3)'
      for (const item of apbdesData) {
        await client.query(insertText, [item.tahun, item.pendapatan, item.belanja])
      }

      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

    return NextResponse.json({ message: 'Data updated successfully' })
  } catch (error) {
    console.error('Error updating APBDes:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
