import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  posterUrl: string | null;
  rating: number;
  overview: string;
  releaseDate?: string;
}

export default function Discover() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const { data: moviesData, isLoading: isFetching } = trpc.movies.getPopular.useQuery({
    page,
  });

  const addToFavoritesMutation = trpc.favorites.add.useMutation();
  const removeFromFavoritesMutation = trpc.favorites.remove.useMutation();

  useEffect(() => {
    if (moviesData?.movies) {
      setMovies(moviesData.movies);
      setCurrentIndex(0);
      setIsLoading(false);
    }
  }, [moviesData]);

  const currentMovie = movies[currentIndex];

  const handleSwipeLeft = async () => {
    if (currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (page < (moviesData?.totalPages || 1)) {
      setPage(page + 1);
      setIsLoading(true);
    }
  };

  const handleSwipeRight = async () => {
    if (currentMovie && user) {
      try {
        await addToFavoritesMutation.mutateAsync({
          movieId: currentMovie.id,
          movieTitle: currentMovie.title,
          posterPath: currentMovie.posterUrl
            ? currentMovie.posterUrl.replace("https://image.tmdb.org/t/p/w500", "")
            : null,
          rating: currentMovie.rating,
          overview: currentMovie.overview,
        });
      } catch (error) {
        console.error("Failed to add favorite:", error);
      }
    }
    handleSwipeLeft();
  };

  if (!user) {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4 glitch-text" data-text="CINEMATCH">
            CINEMATCH
          </h1>
          <p className="text-lg text-cyan-400 mb-8 font-mono">
            &gt; SIGN IN TO DISCOVER YOUR NEXT FAVORITE
          </p>
          <Button
            onClick={() => setLocation("/login")}
            size="lg"
            className="cyber-button font-bold text-lg"
          >
            [ ENTER SYSTEM ]
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || !currentMovie) {
    return (
      <div className="min-h-screen animated-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-cyan-400 font-mono">LOADING CINEMA DATABASE...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-gradient-bg relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div style={{
          backgroundImage: 'linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          height: '100%'
        }} />
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
            <Button variant="ghost" size="icon" className="text-cyan-400 hover:text-cyan-300">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] relative z-10">
        <div className="w-full max-w-sm">
          <SwipeCard
            key={currentMovie.id}
            id={currentMovie.id}
            title={currentMovie.title}
            posterUrl={currentMovie.posterUrl}
            rating={currentMovie.rating}
            overview={currentMovie.overview}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            isLoading={isFetching || addToFavoritesMutation.isPending}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mt-8">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl w-16 h-16 cyber-button border-red-500/50 text-red-400 hover:text-red-300"
              onClick={handleSwipeLeft}
              disabled={isFetching || addToFavoritesMutation.isPending}
            >
              <span className="text-2xl">✕</span>
            </Button>
            <Button
              size="lg"
              className="rounded-xl w-16 h-16 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-400"
              onClick={handleSwipeRight}
              disabled={isFetching || addToFavoritesMutation.isPending}
            >
              <Heart className="w-6 h-6 fill-cyan-400" />
            </Button>
          </div>

          {/* Progress */}
          <div className="text-center mt-8 text-sm text-cyan-400/70 font-mono">
            <p>
              &gt; {currentIndex + 1} / {movies.length}
              {page < (moviesData?.totalPages || 1) && " [MORE AVAILABLE]"}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
