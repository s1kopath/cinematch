import { useEffect, useRef, useState } from "react";
import { Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SwipeCardProps {
  id: number;
  title: string;
  posterUrl: string | null;
  rating: number;
  overview: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isLoading?: boolean;
}

export const SwipeCard = ({
  id,
  title,
  posterUrl,
  rating,
  overview,
  onSwipeLeft,
  onSwipeRight,
  isLoading = false,
}: SwipeCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [swipeState, setSwipeState] = useState<{
    isDragging: boolean;
    startX: number;
    currentX: number;
    direction: "left" | "right" | null;
  }>({
    isDragging: false,
    startX: 0,
    currentX: 0,
    direction: null,
  });

  const SWIPE_THRESHOLD = 100;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLoading) return;
    setSwipeState((prev) => ({
      ...prev,
      isDragging: true,
      startX: e.clientX,
      currentX: e.clientX,
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLoading) return;
    const touch = e.touches[0];
    setSwipeState((prev) => ({
      ...prev,
      isDragging: true,
      startX: touch.clientX,
      currentX: touch.clientX,
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!swipeState.isDragging) return;

    const delta = e.clientX - swipeState.startX;
    const direction = delta > 0 ? "right" : delta < 0 ? "left" : null;

    setSwipeState((prev) => ({
      ...prev,
      currentX: e.clientX,
      direction,
    }));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeState.isDragging) return;

    const touch = e.touches[0];
    const delta = touch.clientX - swipeState.startX;
    const direction = delta > 0 ? "right" : delta < 0 ? "left" : null;

    setSwipeState((prev) => ({
      ...prev,
      currentX: touch.clientX,
      direction,
    }));
  };

  const handleMouseUp = () => {
    if (!swipeState.isDragging) return;

    const delta = swipeState.currentX - swipeState.startX;
    const absDelta = Math.abs(delta);

    if (absDelta > SWIPE_THRESHOLD) {
      if (delta > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    setSwipeState({
      isDragging: false,
      startX: 0,
      currentX: 0,
      direction: null,
    });
  };

  const handleTouchEnd = () => {
    if (!swipeState.isDragging) return;

    const delta = swipeState.currentX - swipeState.startX;
    const absDelta = Math.abs(delta);

    if (absDelta > SWIPE_THRESHOLD) {
      if (delta > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    }

    setSwipeState({
      isDragging: false,
      startX: 0,
      currentX: 0,
      direction: null,
    });
  };

  useEffect(() => {
    if (!swipeState.isDragging) return;

    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove as any);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove as any);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove as any);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [swipeState.isDragging, swipeState.startX, swipeState.currentX]);

  const delta = swipeState.currentX - swipeState.startX;
  const rotation = (delta / 100) * 5;
  const opacity = Math.max(0, 1 - Math.abs(delta) / 200);

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={cn(
        "relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden transition-transform duration-100 neon-border scan-effect shadow-2xl",
        swipeState.isDragging ? "cursor-grabbing" : "cursor-grab",
        isLoading && "opacity-50 pointer-events-none"
      )}
      style={
        swipeState.isDragging
          ? {
              transform: `translateX(${delta}px) rotate(${rotation}deg)`,
            }
          : {}
      }
    >
      {/* Background Image */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-cyan-900/30 to-purple-900/30 flex items-center justify-center border border-cyan-500/30">
          <span className="text-cyan-400/60 text-sm">NO IMAGE</span>
        </div>
      )}

      {/* Overlay Gradient - Cyberpunk */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <h2 className="text-2xl font-bold mb-2 line-clamp-2 glitch-text" data-text={title}>
          {title}
        </h2>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-cyan-500/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-cyan-400/50">
            <span className="text-lg text-cyan-400">★</span>
            <span className="font-bold text-cyan-300">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Overview */}
        <p className="text-sm line-clamp-3 text-cyan-100/80 mb-4 font-mono">{overview}</p>

        {/* Swipe Indicators */}
        {swipeState.isDragging && (
          <div className="flex gap-4 justify-between items-center">
            {swipeState.direction === "left" && (
              <div className="flex items-center gap-2 text-red-400 animate-pulse">
                <X size={24} />
                <span className="font-bold font-mono">SKIP</span>
              </div>
            )}
            {swipeState.direction === "right" && (
              <div className="flex items-center gap-2 text-cyan-400 animate-pulse ml-auto">
                <span className="font-bold font-mono">MATCH</span>
                <Heart size={24} fill="currentColor" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
