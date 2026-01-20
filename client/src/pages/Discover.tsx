import { useEffect, useState } from "react";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { fetchPopularMovies, getPosterUrl } from "@/lib/tmdb";
import { favoritesStore } from "@/lib/favoritesStore";
import { useQuery } from "@tanstack/react-query";

interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  rating: number;
  overview: string;
  releaseDate?: string;
}

export default function Discover() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);

  const {
    data: moviesData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => fetchPopularMovies(page),
  });

  const movies: Movie[] = (moviesData?.results || []).map(movie => ({
    id: movie.id,
    title: movie.title,
    posterUrl: getPosterUrl(movie.poster_path),
    rating: movie.vote_average,
    overview: movie.overview,
    releaseDate: movie.release_date,
  }));

  const currentMovie = movies[currentIndex];

  const handleSwipeLeft = async () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (page < (moviesData?.total_pages || 1)) {
      setPage(prev => prev + 1);
      setCurrentIndex(0);
    }
  };

  const handleSwipeRight = async () => {
    if (currentMovie) {
      setIsAddingFavorite(true);
      try {
        favoritesStore.addFavorite({
          movieId: currentMovie.id,
          movieTitle: currentMovie.title,
          posterPath: currentMovie.posterUrl
            ? currentMovie.posterUrl.replace(
                "https://image.tmdb.org/t/p/w500",
                ""
              )
            : null,
          rating: currentMovie.rating,
          overview: currentMovie.overview,
        });
      } catch (error) {
        console.error("Failed to add favorite:", error);
      } finally {
        setIsAddingFavorite(false);
      }
    }
    handleSwipeLeft();
  };

  if (isLoading || (movies.length > 0 && !currentMovie)) {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-cyan-400 font-mono">LOADING CINEMA DATABASE...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-cyan-400 font-mono">NO MOVIES FOUND.</p>
          <Button onClick={() => setPage(1)} className="mt-4 cyber-button">
            RETRY
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            height: "100%",
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/30">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-cyan-400 fill-cyan-400" />
            <h1 className="text-xl font-bold glitch-text" data-text="CINEMATCH">
              CINEMATCH
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/favorites")}
              className="cyber-button border-cyan-400/50 text-cyan-400 hover:text-cyan-300"
            >
              <Heart className="w-4 h-4 mr-2" />
              MATCHES
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-cyan-400 hover:text-cyan-300"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] relative z-10">
        <div className="w-full max-w-sm">
          {currentMovie && (
            <SwipeCard
              key={currentMovie.id}
              id={currentMovie.id}
              title={currentMovie.title}
              posterUrl={currentMovie.posterUrl}
              rating={currentMovie.rating}
              overview={currentMovie.overview}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              isLoading={isFetching || isAddingFavorite}
            />
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl w-16 h-16 cyber-button border-red-500/50 text-red-400 hover:text-red-300"
              onClick={handleSwipeLeft}
              disabled={isFetching || isAddingFavorite}
            >
              <span className="text-2xl">✕</span>
            </Button>
            <Button
              size="lg"
              className="rounded-xl w-16 h-16 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-400"
              onClick={handleSwipeRight}
              disabled={isFetching || isAddingFavorite}
            >
              <Heart className="w-6 h-6 fill-cyan-400" />
            </Button>
          </div>

          {/* Progress */}
          <div className="text-center mt-8 text-sm text-cyan-400/70 font-mono">
            <p>
              &gt; {currentIndex + 1} / {movies.length}
              {page < (moviesData?.total_pages || 1) && " [MORE AVAILABLE]"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
