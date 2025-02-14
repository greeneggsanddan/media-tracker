'use server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function fetchRatings(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('ratings').select().eq('user_id', id);

    if (error) {
      redirect('/error');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
  }
}