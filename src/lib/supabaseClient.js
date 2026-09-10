import { createClient } from "@supabase/supabase-js";

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// Auto-swap if variables were inverted
if (supabaseUrl?.startsWith("ey") && supabaseKey?.startsWith("http")) {
    console.warn("⚠️ NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY were swapped. Correcting automatically.");
    const temp = supabaseUrl;
    supabaseUrl = supabaseKey;
    supabaseKey = temp;
}

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
