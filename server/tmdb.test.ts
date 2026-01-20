import { describe, expect, it } from "vitest";
import { fetchPopularMovies } from "./tmdb";

describe("TMDB API Integration", () => {
  it("should fetch popular movies successfully with valid API key", async () => {
    const movies = await fetchPopularMovies(1);
    
    expect(movies).toBeDefined();
    expect(Array.isArray(movies.results)).toBe(true);
    expect(movies.results.length).toBeGreaterThan(0);
    
    // Verify movie structure
    const movie = movies.results[0];
    expect(movie).toHaveProperty("id");
    expect(movie).toHaveProperty("title");
    expect(movie).toHaveProperty("poster_path");
    expect(movie).toHaveProperty("vote_average");
    expect(movie).toHaveProperty("overview");
  });

  it("should handle pagination correctly", async () => {
    const page1 = await fetchPopularMovies(1);
    const page2 = await fetchPopularMovies(2);
    
    expect(page1.results).toBeDefined();
    expect(page2.results).toBeDefined();
    // Different pages should have different movies
    expect(page1.results[0]?.id).not.toBe(page2.results[0]?.id);
  });
});
