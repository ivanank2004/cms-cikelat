import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function GET() {
    try {
        const result = await pool.query(
            "SELECT tahun, pendapatan, belanja, uraian_pendapatan, uraian_belanja FROM apbdes ORDER BY tahun DESC"
        );
        const data = result.rows.map((row) => ({
            tahun: row.tahun,
            pendapatan: Number(row.pendapatan.replace(/[^0-9]/g, "")) || 0,
            belanja: Number(row.belanja.replace(/[^0-9]/g, "")) || 0,
            uraian_pendapatan: row.uraian_pendapatan || "",
            uraian_belanja: row.uraian_belanja || "",
        }));
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching APBDes:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        const apbdesData = await request.json();
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            await client.query("DELETE FROM apbdes");
            const insertText =
                "INSERT INTO apbdes (tahun, pendapatan, belanja, uraian_pendapatan, uraian_belanja) VALUES ($1, $2, $3, $4, $5)";
            for (const item of apbdesData) {
                await client.query(insertText, [
                    item.tahun,
                    item.pendapatan,
                    item.belanja,
                    item.uraian_pendapatan,
                    item.uraian_belanja,
                ]);
            }
            await client.query("COMMIT");
        } catch (err) {
            await client.query("ROLLBACK");
            throw err;
        } finally {
            client.release();
        }
        return NextResponse.json({ message: "Data updated successfully" });
    } catch (error) {
        console.error("Error updating APBDes:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        const { tahun, deleteAll } = await request.json();
        const client = await pool.connect();

        try {
            if (deleteAll) {
                // Hapus semua data
                await client.query("DELETE FROM apbdes");
                return NextResponse.json({
                    message: "Semua data berhasil dihapus",
                });
            } else if (tahun) {
                // Hapus data berdasarkan tahun
                const result = await client.query(
                    "DELETE FROM apbdes WHERE tahun = $1",
                    [tahun]
                );
                if (result.rowCount === 0) {
                    return NextResponse.json(
                        { error: "Data tidak ditemukan" },
                        { status: 404 }
                    );
                }
                return NextResponse.json({
                    message: `Data tahun ${tahun} berhasil dihapus`,
                });
            } else {
                return NextResponse.json(
                    { error: "Parameter tidak valid" },
                    { status: 400 }
                );
            }
        } catch (err) {
            console.error("Error deleting APBDes:", err);
            return NextResponse.json(
                { error: "Internal Server Error" },
                { status: 500 }
            );
        } finally {
            client.release();
        }
    } catch (error) {
        console.error("Error processing DELETE request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
