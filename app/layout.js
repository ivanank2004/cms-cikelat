import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // Import Toaster

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export const metadata = {
    title: "Admin Panel Desa Cikelat",
    description: "Admin Panel untuk mengelola konten website Desa Cikelat",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={poppins.className}>
                <Toaster position="top-center" reverseOrder={false} />{" "}
                {/* Tambahkan komponen ini */}
                {children}
            </body>
        </html>
    );
}
