import { SUPABASEKEY, SUPABASEURL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const URL = SUPABASEURL;
const KEY = SUPABASEKEY;

export const supabase = createClient(URL, KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
