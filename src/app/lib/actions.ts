'use server';

import { Rating } from "./types";
import { createClient } from "@/utils/supabase/server";

export async function createRating(rating: Rating) {
  try {
    const supabase = await createClient();
    await supabase.from('ratings').insert(rating);
  } catch (error) {
    console.error('Database Error:', error);
  }
}