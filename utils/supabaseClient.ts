import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lpunjmvrmtsmkqtwktsg.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdW5qbXZybXRzbWtxdHdrdHNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNzYyODAsImV4cCI6MjA3Mzc1MjI4MH0.6ewZr63JwZWsI536xZlXiubmbRLzr7KKf38oe6PCk7c"

export const supabase = createClient(supabaseUrl, supabaseKey)