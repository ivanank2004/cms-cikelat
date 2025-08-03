import { NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
    const { oldPassword, newPassword } = await req.json();

    // 1. Verifikasi token dan dapatkan ID admin dari cookie
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
        return NextResponse.json(
            { error: "Tidak terautentikasi" },
            { status: 401 }
        );
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return NextResponse.json(
            { error: "Token tidak valid" },
            { status: 401 }
        );
    }

    const adminId = decoded.id;

    const client = await pool.connect();
    try {
        // 2. Ambil data admin dari database
        const result = await client.query("SELECT * FROM admin WHERE id = $1", [
            adminId,
        ]);
        const admin = result.rows[0];

        if (!admin) {
            return NextResponse.json(
                { error: "Admin tidak ditemukan" },
                { status: 404 }
            );
        }

        // 3. Bandingkan password lama
        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Password lama salah" },
                { status: 400 }
            );
        }

        // 4. Hash password baru
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 5. Update password di database
        await client.query("UPDATE admin SET password = $1 WHERE id = $2", [
            hashedPassword,
            adminId,
        ]);

        return NextResponse.json({ message: "Password berhasil diubah" });
    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { error: "Gagal mengubah password" },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
