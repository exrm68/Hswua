import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { Movie } from '../types';

interface BannerProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const Banner: React.FC<BannerProps> = ({ movie, onClick }) => {
  return (
    <div 
        onClick={() => onClick(movie)}
        className="relative w-full h-[62vh] overflow-hidden mb-6 group select-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-b-[40px] cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={movie.id}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Image */}
          <img 
            src={movie.thumbnail} 
            alt="Featured" 
            className="w-full h-full object-cover pointer-events-none"
          />
          
          {/* Advanced Gradient Layering for Text Readability */}
          {/* Top Fade */}
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
          
          {/* Bottom Fade - Stronger for text pop */}
          <div className="absolute bottom-0 inset-x-0 h-[80%] bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full p-6 pb-12 z-20 flex flex-col items-center text-center">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-lg px-2 w-full"
            >
                {/* Category Badge */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="bg-gold text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(255,215,0,0.6)] animate-pulse">
                        #1 Trending
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {movie.category}
                    </span>
                </div>
                
                {/* Huge Cinematic Title */}
                <h2 className="text-6xl md:text-8xl font-brand text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 mb-3 leading-[0.8] drop-shadow-2xl tracking-wide uppercase">
                  {movie.title}
                </h2>
                
                {/* Description */}
                <p className="text-gray-300 text-xs line-clamp-2 mb-8 font-medium max-w-[90%] mx-auto leading-relaxed drop-shadow-md opacity-90">
                    {movie.description}
                </p>
                
                {/* Action Button */}
                <div className="flex justify-center relative z-50">
                    <button 
                        className="cursor-pointer relative overflow-hidden bg-white text-black px-12 py-4 rounded-2xl font-black text-sm flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95 group/btn"
                    >
                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite] pointer-events-none" />
                        
                        <Play size={20} fill="black" />
                        <span>PLAY NOW</span>
                    </button>
                </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      <style>{`
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Banner;