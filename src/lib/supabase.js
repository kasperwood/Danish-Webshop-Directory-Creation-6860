import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kbihuzxihtdawsqxmont.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiaWh1enhpaHRkYXdzcXhtb250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMTg4NTcsImV4cCI6MjA2NjY5NDg1N30.iWFkCt73Y2eAi-yse-DjJeDmpL62Yyr8jkrA_6bBjQ4'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables')
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})