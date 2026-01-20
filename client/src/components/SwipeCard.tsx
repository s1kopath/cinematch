import { useState } from "react";
import { Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";

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
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const SWIPE_THRESHOLD = 100;

  const handleDragUpdate = (_: any, info: PanInfo) => {
    if (info.offset.x > 50) {
      setSwipeDirection("right");
    } else if (info.offset.x < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipeRight();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipeLeft();
    }
    setSwipeDirection(null);
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, touchAction: "none" }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDragUpdate}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: "grabbing" }}
      className={cn(
        "relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden neon-border scan-effect shadow-2xl cursor-grab",
        isLoading && "opacity-50 pointer-events-none"
      )}
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
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white pointer-events-none">
        <h2
          className="text-2xl font-bold mb-2 line-clamp-2 glitch-text"
          data-text={title}
        >
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
        <p className="text-sm line-clamp-3 text-cyan-100/80 mb-4 font-mono">
          {overview}
        </p>

        {/* Swipe Indicators */}
        <div className="flex gap-4 justify-between items-center min-h-[40px]">
          {swipeDirection === "left" && (
            <div className="flex items-center gap-2 text-red-400 animate-pulse">
              <X size={24} />
              <span className="font-bold font-mono">SKIP</span>
            </div>
          )}
          {swipeDirection === "right" && (
            <div className="flex items-center gap-2 text-cyan-400 animate-pulse ml-auto">
              <span className="font-bold font-mono">MATCH</span>
              <Heart size={24} fill="currentColor" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
