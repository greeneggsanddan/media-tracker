'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Rating } from './types';

export async function fetchRatings(id: string, mediaType: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('ratings').select().eq('user_id', id).eq('item_type', mediaType);

    if (error) {
      redirect('/error');
    }

    return data;
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchTrending(mediaType: string) {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/${mediaType}/day?language=en-US`,
      options
    );
    const result = await response.json();

    return processedResults(result.results.slice(0, 5), mediaType) as Partial<Rating>[];
  } catch (error) {
    console.error('Error fetching trending items:', error);
  }
}

export async function fetchResults(query: string, mediaType: string) {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };
    const response = await fetch(
      `https://api.themoviedb.org/3/search/${mediaType}?query=${query}&include_adult=false&language=en-US&page=1`,
      options
    );
    const result = await response.json();

    return processedResults(result.results.slice(0,5), mediaType) as Partial<Rating>[];
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

const processedResults = (array: any[], mediaType: string) => {
  return array.map((item) => {
    return {
      item_id: item.id,
      item_type: mediaType,
      title: item.title || item.name,
      poster_path: item.poster_path,
      release_year: Number(item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || null),
    };
  });
}