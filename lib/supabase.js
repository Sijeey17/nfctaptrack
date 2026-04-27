import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  "https://ahtyvfvrrjzgznnokmpw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodHl2ZnZycmp6Z3pubm9rbXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDA3MzgsImV4cCI6MjA5Mjg3NjczOH0.jj38fub9oobavxwQXe3BOZo9WZJFpsO6stzcE6x8k_I"
)

export default supabase