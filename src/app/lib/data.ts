import { sql } from '@vercel/postgres';
import { Rating } from './types';

export async function fetchRatings(id: string) {
  try {
    const data = await sql<Rating>`SELECT * FROM ratings WHERE user_id = '${id}'`;
    return data.rows
  } catch (error) {
    console.error('Database Error:', error);
  }
}