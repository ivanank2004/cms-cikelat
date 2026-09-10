export function getImageUrl(path) {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (supabaseUrl?.startsWith("ey") && supabaseKey?.startsWith("http")) {
        supabaseUrl = supabaseKey;
    }

    return `${supabaseUrl}/storage/v1/object/public/cms-desa-cikelat/${path}`;
}
