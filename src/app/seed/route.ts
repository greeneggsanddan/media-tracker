import { db } from "@vercel/postgres";
import bcrypt from "bcrypt";
import { users, ratings } from "../lib/placeholder-data";

const client = await db.connect();

async function seedUsers() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  const insertedUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      return client.sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    })
  );

  return insertedUsers;
}

async function seedRatings() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS ratings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID NOT NULL,
      item_id UUID NOT NULL,
      item_type TEXT NOT NULL,
      user_rating INT,
      position INT,
      title TEXT NOT NULL,
      poster_path TEXT NOT NULL
    );
  `;

  const insertedRatings = await Promise.all(
    ratings.map(
      (rating) => client.sql`
        INSERT INTO ratings (id, user_id, item_id, item_type, user_rating, position, title, poster_path)
        VALUES (${rating.id}, ${rating.user_id}, ${rating.item_id}, ${rating.item_type}, ${rating.user_rating}, ${rating.position}, ${rating.title}, ${rating.poster_path})
        ON CONFLICT (id) DO NOTHING;
      `
    )
  );

  return insertedRatings;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await seedUsers();
    await seedRatings();
    await client.sql`COMMIT`;

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    await client.sql`ROLLBACK`;
    return Response.json({ error }, { status: 500 });
  }
}