import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"

const SUPABASE_URL = "https://zqlduhwnipidtweqqnyj.supabase.co"                                    /* palauta takaisin export const supabase = createClient( */
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxbGR1aHduaXBpZHR3ZXFxbnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzA4ODMsImV4cCI6MjA4ODE0Njg4M30.7Zv7WkdxoXAAVYt_h1buLSgB__D8l1_NJmUYIfXQLyM"                                       /* palauta takaisin import.meta.env.VITE_SUPABASE_URL, */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)                                   /* palauta takaisin import.meta.env.VITE_SUPABASE_ANON_KEY */
                                                                                 /* palauta takaisin ) */
