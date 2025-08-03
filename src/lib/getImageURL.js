export function getImageUrl(path) {
    // If path is null/undefined or already a complete URL, return it as is
    if (!path || path.startsWith("http")) {
        return path;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
        console.error("NEXT_PUBLIC_SUPABASE_URL is not defined");
        return path;
    }

    return `${supabaseUrl}/storage/v1/object/public/cms-desa-cikelat/${path}`;
}
