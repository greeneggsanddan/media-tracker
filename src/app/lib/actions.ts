'use server';

import { Rating } from "./types";
import { createClient } from "@/utils/supabase/server";

export async function createRating(rating: Partial<Rating>) {
  try {
    const supabase = await createClient();
    const response = await supabase.from('ratings').insert(rating).select().single();
    return response.data as Rating;
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function updateRating(rating: Rating, position: number) {
  try {
    const supabase = await createClient();
    await supabase.from('ratings').update({ position }).eq('id', rating.id);
  } catch (error) {
    console.error('Database Error:', error);
  }

}