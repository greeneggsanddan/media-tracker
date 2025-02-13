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
    console.log('Rating deleted:', id);
  } catch (error) {
    console.error('Database Error:', error);
  }
}

export async function fetchResults(query: string) {
  try {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
      },
    };
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`,
      options
    );
    const result = await response.json();

    return result.results.slice(0, 5);
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

// import { NextResponse } from 'next/server';

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get('query');

//   if (!query) {
//     return NextResponse.json(
//       { error: 'Query parameter is required' },
//       { status: 400 }
//     );
//   }

//   try {
//     const response = await fetch(
//       `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Failed to fetch data' },
//       { status: 500 }
//     );
//   }
// }

// const handleSearch = async (query: string) => {
//   if (!query) {
//     setData([]);
//     return;
//   }

//   try {
//     const response = await fetch(
//       `/api/search?query=${encodeURIComponent(query)}`
//     );
//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.error || 'Failed to fetch results');
//     }

//     setData(result.results.slice(0, 5));
//   } catch (error) {
//     console.error('Error fetching search results:', error);
//     setData([]);
//   }
// };
