import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dxqgppxxavdtoxvqfyeo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cWdwcHh4YXZkdG94dnFmeWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzOTg3ODksImV4cCI6MjEwNDk3NDc4OX0.DwLszrd9242Krj_4ILv5B99tbY3OpXYnEr10jmUrFDA'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
