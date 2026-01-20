import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { Favorite, favorites } from "../drizzle/schema";

// In-memory fallback for favorites when no database is available.
const memoryFavorites: Favorite[] = [];
let nextId = 1;

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
    console.warn("[Favorites] Database not available, using in-memory storage");
    if (
      !memoryFavorites.some(f => f.userId === userId && f.movieId === movieId)
    ) {
      memoryFavorites.push({
        id: nextId++,
        userId,
        movieId,
        movieTitle,
        posterPath,
        rating,
        overview,
        addedAt: new Date(),
      });
    }
    return;
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

export async function removeFavorite(
  userId: number,
  movieId: number
): Promise<void> {
  const db = await getDb();
  if (!db) {
    const index = memoryFavorites.findIndex(
      f => f.userId === userId && f.movieId === movieId
    );
    if (index !== -1) {
      memoryFavorites.splice(index, 1);
    }
    return;
  }

  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)));
}

export async function getUserFavorites(userId: number): Promise<Favorite[]> {
  const db = await getDb();
  if (!db) {
    return memoryFavorites
      .filter(f => f.userId === userId)
      .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
  }

  const result = await db
    .select()
    .from(favorites)
    .where(eq(favorites.userId, userId))
    .orderBy(favorites.addedAt);

  return result;
}

export async function isFavorited(
  userId: number,
  movieId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return memoryFavorites.some(
      f => f.userId === userId && f.movieId === movieId
    );
  }

  const result = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.movieId, movieId)))
    .limit(1);

  return result.length > 0;
}
