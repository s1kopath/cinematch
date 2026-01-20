import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Grid3x3, List, Trash2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { favoritesStore } from "@/lib/favoritesStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type ViewMode = "grid" | "list";

export default function Favorites() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => favoritesStore.getFavorites(),
  });

  const handleRemove = (movieId: number) => {
    favoritesStore.removeFavorite(movieId);
    queryClient.invalidateQueries({ queryKey: ["favorites"] });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-cyan-400 font-mono">RETRIEVING MATCHES...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-cyan-500/30">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-cyan-400 fill-cyan-400" />
              <h1
                className="text-xl font-bold glitch-text"
                data-text="MY MATCHES"
              >
                MY MATCHES
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className={
                viewMode === "grid"
                  ? "cyber-button"
                  : "border-cyan-400/50 text-cyan-400"
              }
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className={
                viewMode === "list"
                  ? "cyber-button"
                  : "border-cyan-400/50 text-cyan-400"
              }
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 relative z-10">
        {!favorites || favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Heart className="w-16 h-16 text-cyan-400/30 mb-4" />
            <h2 className="text-2xl font-bold text-cyan-400 mb-2 font-mono">
              NO MATCHES FOUND
            </h2>
            <p className="text-cyan-400/70 mb-8 font-mono">
              &gt; START SWIPING TO FIND YOUR NEXT FAVORITE
            </p>
            <Button
              onClick={() => setLocation("/")}
              size="lg"
              className="cyber-button"
            >
              [ DISCOVER CINEMA ]
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(movie => (
              <div
                key={movie.id}
                className="group relative rounded-2xl overflow-hidden neon-border scan-effect hover:shadow-lg transition-all"
              >
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.movieTitle}
                    className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center border border-cyan-500/30 rounded-2xl">
                    <span className="text-cyan-400/60 text-sm text-center px-4">
                      NO IMAGE
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 rounded-2xl">
                  <h3 className="text-cyan-300 font-bold mb-2 line-clamp-2 font-mono">
                    {movie.movieTitle}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-cyan-400">
                      <span>★</span>
                      <span className="text-sm font-semibold">
                        {movie.rating.toFixed(1)}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(movie.movieId)}
                      className="bg-red-500/20 hover:bg-red-500/40 border border-red-400/50 text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map(movie => (
              <div
                key={movie.id}
                className="flex gap-4 bg-slate-800/40 rounded-xl overflow-hidden neon-border scan-effect hover:shadow-lg transition-all p-4"
              >
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.movieTitle}
                    className="w-24 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-32 bg-gradient-to-br from-cyan-900/30 to-purple-900/30 rounded-lg flex items-center justify-center border border-cyan-500/30">
                    <span className="text-cyan-400/60 text-xs text-center">
                      NO IMAGE
                    </span>
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-cyan-300 mb-1 font-mono">
                      {movie.movieTitle}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-cyan-400">
                        <span>★</span>
                        <span className="font-semibold">
                          {movie.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-cyan-400/60 font-mono">
                        {new Date(movie.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-cyan-400/70 line-clamp-2 font-mono">
                      {movie.overview}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(movie.movieId)}
                    className="w-fit bg-red-500/20 hover:bg-red-500/40 border border-red-400/50 text-red-400 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    REMOVE
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
