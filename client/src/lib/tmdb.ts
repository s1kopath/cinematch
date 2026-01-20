const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  overview: string;
  release_date?: string;
  genre_ids?: number[];
  popularity?: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetail extends TMDBMovie {
  runtime?: number;
  genres?: Array<{ id: number; name: string }>;
  production_companies?: Array<{ id: number; name: string }>;
}

async function makeRequest<T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("VITE_TMDB_API_KEY is not configured in .env");
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ),
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function fetchPopularMovies(
  page: number = 1
): Promise<TMDBResponse> {
  return makeRequest<TMDBResponse>("/movie/popular", { page });
}

export async function fetchUpcomingMovies(
  page: number = 1
): Promise<TMDBResponse> {
  return makeRequest<TMDBResponse>("/movie/upcoming", { page });
}

export async function fetchTopRatedMovies(
  page: number = 1
): Promise<TMDBResponse> {
  return makeRequest<TMDBResponse>("/movie/top_rated", { page });
}

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse> {
  return makeRequest<TMDBResponse>("/search/movie", { query, page });
}

export async function getMovieDetails(movieId: number): Promise<MovieDetail> {
  return makeRequest<MovieDetail>(`/movie/${movieId}`);
}

export function getPosterUrl(posterPath: string | null): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}
