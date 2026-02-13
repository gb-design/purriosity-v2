import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Search functionality may not work.');
}

// Create a single supabase client for interacting with your database
const createSupabaseClient = () => {
    if (supabaseUrl && supabaseAnonKey) {
        return createClient(supabaseUrl, supabaseAnonKey);
    }

    console.warn('Supabase credentials missing. Using mock client.');

    // Return a mock client that doesn't crash but logs warnings
    return {
        from: () => ({
            select: () => ({
                or: () => ({
                    limit: () => Promise.resolve({ data: [], error: null })
                })
            })
        })
    } as any;
};

export const supabase = createSupabaseClient();
