import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '../types';

interface TrendingRowProps {
  movies: Movie[];
  onClick: (movie: Movie) => void;
}

const TrendingRow: React.FC<TrendingRowProps> = ({ movies, onClick }) => {
  return (
    <div className="mb-10 relative z-0">
      <h3 className="text-lg font-serif font-bold text-white mb-4 px-1 flex items-center gap-2">
        <span className="text-gold text-2xl drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">★</span> Top 10 Trending
      </h3>
      
      {/* Changed to free scrolling (removed snap-x) for smoother experience */}
      <div className="flex overflow-x-auto no-scrollbar gap-5 px-4 pb-4">
        {movies.slice(0, 10).map((movie, index) => (
          <motion.div 
            key={movie.id}
            className="relative shrink-0 w-[140px] h-[210px] cursor-pointer group"
            onClick={() => onClick(movie)}
            whileTap={{ scale: 0.95 }}
          >
            {/* Big Number - Added pointer-events-none so it doesn't block clicks */}
            <div className="absolute -left-5 bottom-0 text-[110px] font-black leading-none z-10 font-serif text-stroke-gold drop-shadow-2xl select-none pointer-events-none opacity-90">
              {index + 1}
            </div>
            
            {/* Card */}
            <div className="absolute right-0 top-0 w-[115px] h-[170px] rounded-lg overflow-hidden border border-white/15 shadow-2xl z-20 group-hover:border-gold/50 transition-colors bg-[#111]">
               <img src={movie.thumbnail} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
               
               {/* Small overlay for depth */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
            </div>

            <style>{`
                .text-stroke-gold {
                    -webkit-text-stroke: 2px #444;
                    color: black;
                }
            `}</style>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrendingRow;