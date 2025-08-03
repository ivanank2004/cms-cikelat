// src/lib/getHomeData.js
export async function getHomeData() {
  const resHome = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/home-data`, { cache: 'no-store' });
  const resBerita = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/berita`, { cache: 'no-store' });
  const resProduk = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/produk`, { cache: 'no-store' });

  const [homeData, beritaDataRaw, produkData] = await Promise.all([
    resHome.json(),
    resBerita.json(),
    resProduk.json(),
  ]);

  const beritaSorted = beritaDataRaw.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  return {
    ...homeData,
    berita: beritaSorted.slice(0, 6),
    produk: produkData.slice(0, 6),
  };
}
