import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Favorites Router", () => {
  it("should add a movie to favorites", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.favorites.add({
      movieId: 550,
      movieTitle: "Fight Club",
      posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      rating: 8.8,
      overview: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club...",
    });

    expect(result).toEqual({ success: true });
  });

  it("should list user favorites", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Add a movie
    await caller.favorites.add({
      movieId: 550,
      movieTitle: "Fight Club",
      posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      rating: 8.8,
      overview: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club...",
    });

    // List favorites
    const favorites = await caller.favorites.list();

    expect(Array.isArray(favorites)).toBe(true);
    expect(favorites.length).toBeGreaterThan(0);
    expect(favorites[0]).toHaveProperty("movieId");
    expect(favorites[0]).toHaveProperty("movieTitle");
    expect(favorites[0]).toHaveProperty("rating");
  });

  it("should check if a movie is favorited", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const movieId = 550;

    // Add to favorites
    await caller.favorites.add({
      movieId,
      movieTitle: "Fight Club",
      posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      rating: 8.8,
      overview: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club...",
    });

    // Check if favorited
    const result = await caller.favorites.isFavorited({ movieId });

    expect(result.favorited).toBe(true);
  });

  it("should remove a movie from favorites", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const movieId = 550;

    // Add to favorites
    await caller.favorites.add({
      movieId,
      movieTitle: "Fight Club",
      posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      rating: 8.8,
      overview: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club...",
    });

    // Remove from favorites
    const removeResult = await caller.favorites.remove({ movieId });
    expect(removeResult).toEqual({ success: true });

    // Verify it's removed
    const isFavoritedResult = await caller.favorites.isFavorited({ movieId });
    expect(isFavoritedResult.favorited).toBe(false);
  });
});
