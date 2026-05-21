import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const fallbackSupabaseUrl = 'https://wzychmshebmznjfducug.supabase.co';
const fallbackSupabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6eWNobXNoZWJtem5qZmR1Y3VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzOTkxNTksImV4cCI6MjA5NDk3NTE1OX0.MWz4GjhNuElOqLq27SfUfmlnNjAy8H78UDkICN_5rZw';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? fallbackSupabaseUrl;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? fallbackSupabaseAnonKey;
const memoryStorage = new Map<string, string>();

const safeStorage = {
  async getItem(key: string) {
    if (typeof window === 'undefined') {
      return memoryStorage.get(key) ?? null;
    }

    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    if (typeof window === 'undefined') {
      memoryStorage.set(key, value);
      return;
    }

    await AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string) {
    if (typeof window === 'undefined') {
      memoryStorage.delete(key);
      return;
    }

    await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});