export interface Favorite {
  id: number;
  userId: number; // Keep for compatibility with existing components
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  rating: number;
  overview: string;
  addedAt: string; // Stored as ISO string in localStorage
}

const STORAGE_KEY = "movie_tinder_favorites";

export const favoritesStore = {
  getFavorites(): Favorite[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  addFavorite(movie: Omit<Favorite, "id" | "userId" | "addedAt">) {
    const favorites = this.getFavorites();
    if (favorites.some(f => f.movieId === movie.movieId)) return;

    const newFavorite: Favorite = {
      ...movie,
      id: Date.now(),
      userId: 1, // Default guest ID
      addedAt: new Date().toISOString(),
    };

    const updated = [...favorites, newFavorite];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newFavorite;
  },

  removeFavorite(movieId: number) {
    const favorites = this.getFavorites();
    const updated = favorites.filter(f => f.movieId !== movieId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  isFavorited(movieId: number): boolean {
    const favorites = this.getFavorites();
    return favorites.some(f => f.movieId === movieId);
  },
};
