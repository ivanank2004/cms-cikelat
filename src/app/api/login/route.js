import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Inisialisasi koneksi database langsung di sini
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
})

export async function POST(req) {
    try {
        const { username, password } = await req.json()

        const query = 'SELECT * FROM admin WHERE username = $1 LIMIT 1'
        const result = await pool.query(query, [username])

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Akun tidak ditemukan' }, { status: 401 })
        }

        const admin = result.rows[0]
        const passwordMatch = await bcrypt.compare(password, admin.password)

        if (!passwordMatch) {
            return NextResponse.json({ message: 'Password salah' }, { status: 401 })
        }

        const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        })

        const response = NextResponse.json({ message: 'Login berhasil' })
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 hari
        })

        return response
    } catch (err) {
        console.error('Login error:', err)
        return NextResponse.json({ message: 'Terjadi kesalahan pada server' }, { status: 500 })
    }
}
