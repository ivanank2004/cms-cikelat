import { NextResponse } from "next/server";
import { Pool } from "pg";
import { supabase } from "@/lib/supabaseClient";
import { getImageUrl } from "@/lib/getImageURL";
import { extractPathFromUrl } from "@/lib/deleteFileFromSupabase";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// GET - Ambil semua berita
export async function GET() {
    try {
        const client = await pool.connect();
        const result = await client.query(
            "SELECT * FROM berita ORDER BY tanggal DESC"
        );
        client.release();
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json(
            { error: "Gagal mengambil data berita" },
            { status: 500 }
        );
    }
}

// POST - Tambah atau update berita
export async function POST(req) {
    try {
        const formData = await req.formData();
        const id = formData.get("id");
        const judul = formData.get("judul");
        const tanggal = formData.get("tanggal");
        const sumber = formData.get("sumber");
        const isi = formData.get("isi");
        const gambar = formData.get("gambar"); // bisa File, URL string, atau null

        let gambarUrl = null;

        // Upload gambar ke Supabase jika ada file
        if (gambar && typeof gambar === "object") {
            const fileExt = gambar.name.split(".").pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `berita/${fileName}`;

            const { error } = await supabase.storage
                .from("cms-desa-cikelat")
                .upload(filePath, gambar);

            if (error) throw error;

            gambarUrl = getImageUrl(filePath);
        }
        // Jika gambar adalah string (URL), gunakan langsung
        else if (gambar && typeof gambar === "string") {
            gambarUrl = gambar;
        }

        const client = await pool.connect();

        let result;
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
      `;
            const values = [judul, tanggal, gambarUrl, sumber, isi, id];
            result = await client.query(query, values);
        } else {
            // Insert
            const query = `
        INSERT INTO berita (judul, tanggal, gambar, sumber, isi)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
            const values = [judul, tanggal, gambarUrl, sumber, isi];
            result = await client.query(query, values);
        }

        client.release();
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("POST error:", error);
        return NextResponse.json(
            { error: "Gagal menyimpan data berita" },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(request) {
    try {
        const { id } = await request.json();

        // Ambil data berita yang akan dihapus untuk menghapus gambar terkait
        const client = await pool.connect();
        try {
            // Ambil informasi gambar terlebih dahulu
            const result = await client.query(
                "SELECT gambar FROM berita WHERE id = $1",
                [id]
            );

            if (result.rows.length > 0 && result.rows[0].gambar) {
                // Hapus file gambar dari storage jika ada
                const imageUrl = result.rows[0].gambar;
                const pathInfo = extractPathFromUrl(imageUrl);

                if (pathInfo) {
                    await supabase.storage
                        .from(pathInfo.bucket)
                        .remove([pathInfo.path]);
                }
            }

            // Hapus data dari database
            await client.query("DELETE FROM berita WHERE id = $1", [id]);

            return NextResponse.json({ message: "Berita berhasil dihapus" });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error deleting berita:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
