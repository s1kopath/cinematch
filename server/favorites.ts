import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { favorites } from "../drizzle/schema";

export async function addFavorite(
  userId: number,
  movieId: number,
  movieTitle: string,
  posterPath: string | null,
  rating: number,
  overview: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.insert(favorites).values({
    userId,
    movieId,
    movieTitle,
    posterPath,
    rating,
    overview,
    addedAt: new Date(),
  });
}

export async function removeFavorite(userId: number, movieId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)));
}

export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(favorites.addedAt);

  return result;
}

export async function isFavorited(userId: number, movieId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)))
    .limit(1);

  return result.length > 0;
}
