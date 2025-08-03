import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export async function POST(req) {
    const { username, password } = await req.json();
    const client = await pool.connect();

    try {
        const result = await client.query(
            "SELECT * FROM admin WHERE username = $1",
            [username]
        );
        const admin = result.rows[0];

        if (!admin) {
            return NextResponse.json(
                { message: "Username atau password salah" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return NextResponse.json(
                { message: "Username atau password salah" },
                { status: 401 }
            );
        }

        // Buat token JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h", // Token berlaku selama 1 jam
            }
        );

        // Buat respons JSON
        const response = NextResponse.json({ message: "Login berhasil" });

        // Ubah nama cookie dari "auth_token" menjadi "token" agar sesuai dengan middleware
        response.cookies.set("token", token, {
            httpOnly: true, // Mencegah akses dari JavaScript sisi klien
            secure: process.env.NODE_ENV !== "development", // Hanya kirim melalui HTTPS di produksi
            maxAge: 60 * 60, // Masa berlaku cookie dalam detik (1 jam)
            path: "/", // Cookie berlaku untuk seluruh situs
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
