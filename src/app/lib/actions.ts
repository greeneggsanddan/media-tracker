'use server';

import { Rating } from './types';
import { createClient } from '@/utils/supabase/server';

export async function createRating(rating: Partial<Rating>) {
  try {
    const supabase = await createClient();
    const response = await supabase
      .from('ratings')
      .insert(rating)
      .select()
      .single();
    return response.data as Rating;
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function updateRatings(ratings: Rating[]) {
  try {
    const supabase = await createClient();
    await Promise.all(
      ratings.map(async (rating) => {
        await supabase
          .from('ratings')
          .update({
            user_rating: rating.user_rating,
            position: rating.position,
          })
          .eq('id', rating.id);
      })
    );
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function deleteRating(id: string) {
  try {
    const supabase = await createClient();
    await supabase.from('ratings').delete().eq('id', id);
  } catch (error) {
    console.error('Database Error:', error);
  }
}