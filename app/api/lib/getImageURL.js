export function getImageUrl(path) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${supabaseUrl}/storage/v1/object/public/cms-desa-cikelat/${path}`;
}
