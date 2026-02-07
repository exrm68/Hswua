import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, DownloadCloud } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (movie: Movie) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, isFavorite, onToggleFavorite, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileTap={{ scale: 0.96 }}
      className="relative rounded-xl overflow-hidden bg-[#111] border border-white/5 aspect-[2/3] cursor-pointer shadow-xl group"
      onClick={() => onClick(movie)}
    >
      {/* Top Badges */}
      <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start">
          {/* Favorite (Heart) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie.id);
            }}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-90 transition-all hover:bg-black/60 shadow-lg"
          >
            <Heart
              size={14}
              className={`${isFavorite ? 'fill-[#ff0a16] text-[#ff0a16]' : 'text-white'} transition-colors duration-300`}
            />
          </button>

          {/* Unique Download Icon */}
          <div className="w-8 h-8 rounded-full bg-gold/90 backdrop-blur-md flex items-center justify-center shadow-[0_0_10px_rgba(255,215,0,0.4)]">
             <DownloadCloud size={14} className="text-black font-bold" />
          </div>
      </div>

      {/* Image */}
      <img
        src={movie.thumbnail}
        alt={movie.title}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Clean Gradient for Bottom Text */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />

      {/* Bottom Information Bar */}
      <div className="absolute bottom-0 inset-x-0 p-3 pt-6 z-20">
        
        {/* Title Section - Removed prefix icon, cleaned up font */}
        <h3 className="text-sm font-sans font-bold text-white truncate mb-1.5 drop-shadow-md tracking-tight">
            {movie.title}
        </h3>
        
        {/* Meta Data */}
        <div className="flex items-center justify-between opacity-90">
           <span className="text-[10px] text-gray-300 font-medium">
              {movie.category === 'Korean Drama' ? 'K-Drama' : movie.category}
           </span>
           <div className="flex items-center gap-1">
               <span className="text-gold text-[10px]">★</span>
               <span className="text-[10px] text-white font-bold">
                  {movie.rating}
               </span>
           </div>
        </div>
      </div>
      
      {/* Active Border Glow */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gold/30 transition-colors pointer-events-none" />
    </motion.div>
  );
};

export default MovieCard;