import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function GET() {
    try {
        const result = await pool.query('SELECT tahun, pendapatan, belanja FROM apbdes ORDER BY tahun DESC')
        // pendapatan dan belanja bertipe TEXT, kita coba parse ke number jika bisa
        const data = result.rows.map(row => ({
            tahun: row.tahun,
            pendapatan: Number(row.pendapatan.replace(/[^0-9]/g, '')) || 0, // buang karakter non digit
            belanja: Number(row.belanja.replace(/[^0-9]/g, '')) || 0,
        }))

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error fetching APBDes:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
