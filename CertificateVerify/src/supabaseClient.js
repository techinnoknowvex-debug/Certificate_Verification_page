import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rhgashcnsprhznkkwfyh.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoZ2FzaGNuc3ByaHpua2t3ZnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0Njc5MzMsImV4cCI6MjA4ODA0MzkzM30.yvl7vd2Njes_VUBIrp4VaHEv3A_cQVK2GyPpUF9S-h8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)