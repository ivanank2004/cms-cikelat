import { NextResponse } from "next/server";
import { Pool } from "pg";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/getImageURL";
import { extractPathFromUrl } from "@/lib/deleteFileFromSupabase";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// GET: Ambil semua produk
export async function GET() {
    try {
        const { rows } = await pool.query(
            "SELECT * FROM produk ORDER BY id DESC"
        );
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json(
            { error: "Gagal mengambil data produk" },
            { status: 500 }
        );
    }
}

// POST: Tambah produk baru
export async function POST(req) {
    try {
        const body = await req.json();
        const { nama, harga, kontak, gambar, deskripsi } = body;

        const query = `
            INSERT INTO produk (nama, harga, gambar, kontak, deskripsi)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const values = [
            nama,
            harga,
            gambar || null,
            kontak || null,
            deskripsi || null,
        ];
        const { rows } = await pool.query(query, values);
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("POST error:", error);
        return NextResponse.json(
            { error: "Gagal menambahkan produk" },
            { status: 500 }
        );
    }
}

// PUT: Update produk
export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, nama, harga, kontak, gambar, deskripsi } = body;

        const query = `
            UPDATE produk
            SET nama = $1, harga = $2, gambar = $3, kontak = $4, deskripsi = $5
            WHERE id = $6 RETURNING *
        `;
        const values = [
            nama,
            harga,
            gambar || null,
            kontak || null,
            deskripsi || null,
            id,
        ];
        const { rows } = await pool.query(query, values);
        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("PUT error:", error);
        return NextResponse.json(
            { error: "Gagal memperbarui produk" },
            { status: 500 }
        );
    }
}

// DELETE: Hapus produk berdasarkan ID
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { id } = body;

        // Ambil informasi gambar terlebih dahulu
        const resultImg = await pool.query(
            "SELECT gambar FROM produk WHERE id = $1",
            [id]
        );

        if (resultImg.rows.length > 0 && resultImg.rows[0].gambar) {
            // Hapus file gambar dari storage jika ada
            const imageUrl = resultImg.rows[0].gambar;
            const pathInfo = extractPathFromUrl(imageUrl);

            if (pathInfo) {
                await supabase.storage
                    .from(pathInfo.bucket)
                    .remove([pathInfo.path]);
            }
        }

        await pool.query("DELETE FROM produk WHERE id = $1", [id]);
        return NextResponse.json({ message: "Produk berhasil dihapus" });
    } catch (error) {
        console.error("DELETE error:", error);
        return NextResponse.json(
            { error: "Gagal menghapus produk" },
            { status: 500 }
        );
    }
}
