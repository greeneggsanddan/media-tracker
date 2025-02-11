import { createClient } from '@/utils/supabase/client';

export async function fetchRatings(id: string) {
  try {
    const supabase = await createClient();
    const response = await supabase.from("ratings").select().eq('user_id', id);
    return response.data;
  } catch (error) {
    console.error('Database Error:', error);
  }
}