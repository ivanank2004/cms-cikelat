export function getImageUrl(path) {
    // If path is null/undefined or already a complete URL, return it as is
    if (!path || path.startsWith("http")) {
        return path;
    }

    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

    if (supabaseUrl?.startsWith("ey") && supabaseKey?.startsWith("http")) {
        supabaseUrl = supabaseKey;
    }

    if (!supabaseUrl) {
        console.error("NEXT_PUBLIC_SUPABASE_URL is not defined");
        return path;
    }

    return `${supabaseUrl}/storage/v1/object/public/cms-desa-cikelat/${path}`;
}
