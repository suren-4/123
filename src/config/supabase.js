import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug logging
console.log('Initializing Supabase with URL:', supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase configuration. Check your .env file.');
    throw new Error('Missing Supabase URL or Key. Please check your environment variables.');
}

let supabase;

try {
    supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }
    });

    // Test the client
    console.log('Supabase client initialized successfully');
} catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
}

export { supabase }; 