import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../types';

interface StoryCircleProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  index: number;
}

const StoryCircle: React.FC<StoryCircleProps> = ({ movie, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
      onClick={() => onClick(movie)}
    >
      {/* Gradient Ring Container */}
      <div className="relative w-[76px] h-[76px] rounded-full p-[3px] bg-gradient-to-b from-[#ff0055] via-[#ff0055] to-gold group-hover:scale-105 transition-transform duration-300 shadow-[0_4px_10px_rgba(255,0,85,0.3)]">
        {/* Black Border inside Ring */}
        <div className="w-full h-full rounded-full bg-black p-[3px] overflow-hidden relative">
           {/* Image */}
           <img 
             src={movie.thumbnail} 
             alt={movie.title} 
             className="w-full h-full rounded-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
           />
           {/* Dark Overlay for depth */}
           <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
        </div>
        
        {/* Live Badge for specific items */}
        {index === 0 && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded border border-black animate-pulse shadow-sm">
                BTS
            </div>
        )}
      </div>
      
      <span className="text-[10px] text-gray-300 w-16 truncate text-center font-medium group-hover:text-white transition-colors">
        {movie.title.split(' ')[0]}
      </span>
    </motion.div>
  );
};

export default StoryCircle;