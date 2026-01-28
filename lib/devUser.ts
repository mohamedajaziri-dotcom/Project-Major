/**
 * Development User ID
 * 
 * TODO: Replace with proper authentication when implemented.
 * For now, using a constant user ID for local development.
 * 
 * To set this up:
 * 1. Create a user in your Supabase project (via SQL or auth signup)
 * 2. Get the UUID from auth.users table
 * 3. Replace the value below
 */
export const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

// Helper to check if we're in dev mode
export const isDev = process.env.NODE_ENV === "development";
