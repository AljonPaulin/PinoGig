import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants';

const URL = Constants.expoConfig?.extra?.SUPABASEURL;
const KEY = Constants.expoConfig?.extra?.SUPABASEKEY;

export const supabase = createClient(URL, KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
