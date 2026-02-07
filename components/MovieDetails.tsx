import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, ShieldCheck, X, Download, Send, ChevronDown } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  botUsername: string;
  channelLink: string;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onClose, botUsername, channelLink }) => {
  const [activeTab, setActiveTab] = useState<'episodes' | 'info'>('episodes');
  const [selectedSeason, setSelectedSeason] = useState<number>(1);

  const handleAction = (code: string) => {
    // Dynamic Deep Link Generation
    const url = `https://t.me/${botUsername}?start=${code}`;
    
    // @ts-ignore
    if (window.Telegram?.WebApp) {
        // @ts-ignore
        window.Telegram.WebApp.openTelegramLink(url);
    } else {
        window.open(url, '_blank');
    }
  };

  const isSeries = movie.category === 'Series' || movie.category === 'Korean Drama' || (movie.episodes && movie.episodes.length > 0);

  // Group episodes by season
  const episodesBySeason = useMemo(() => {
      if (!movie.episodes) return {};
      const groups: Record<number, typeof movie.episodes> = {};
      movie.episodes.forEach(ep => {
          const s = ep.season || 1; // Default to season 1 if missing
          if (!groups[s]) groups[s] = [];
          groups[s].push(ep);
      });
      // Sort seasons keys
      return groups;
  }, [movie.episodes]);

  const availableSeasons = Object.keys(episodesBySeason).map(Number).sort((a,b) => a-b);
  const currentEpisodes = episodesBySeason[selectedSeason] || [];

  return (
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] bg-[#000] flex flex-col h-full font-sans"
      >
        {/* Parallax Background Layer */}
        <div className="absolute top-0 left-0 w-full h-[60vh] z-0">
             <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-full object-cover opacity-60 mask-image-gradient"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-[#000]/80 to-transparent" />
        </div>

        {/* Fixed Header with Working Close Button */}
        <div className="absolute top-0 inset-x-0 z-[110] flex justify-between items-center p-4 pt-6 pointer-events-none">
            {/* Using pointer-events-auto to ensure clicks register */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="pointer-events-auto w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 transition-all shadow-lg"
            >
                <X size={22} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-[35vh]">
            <div className="px-6 pb-24 bg-gradient-to-t from-black via-black to-transparent min-h-[65vh]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-gold text-black px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                    {movie.category}
                  </span>
                  <span className="bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-gray-200 border border-white/10">
                      {movie.quality || 'HD'}
                  </span>
                  {movie.year && (
                     <span className="text-gray-400 text-xs font-bold pl-1">• {movie.year}</span>
                  )}
                </div>
                
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-serif font-black text-white leading-[1.0] mb-4 drop-shadow-2xl">
                  {movie.title}
                </h1>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-semibold text-gray-300 mb-8 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-1.5 text-gold">
                    <Star size={14} fill="#FFD700" />
                    <span className="text-white">{movie.rating}</span>
                  </div>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span>{movie.views} Views</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-green-500"/> Verified</span>
                </div>

                {/* Action Buttons (Movies) */}
                {!isSeries && (
                  <div className="flex flex-col gap-3 w-full mb-8">
                    <div className="flex gap-3">
                        <button
                        onClick={() => handleAction(movie.telegramCode)}
                        className="flex-1 bg-gold text-black py-4 px-6 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:bg-[#ffe033] active:scale-98 transition-all"
                        >
                        <Play size={20} fill="black" />
                        STREAM
                        </button>
                        
                        <button
                        onClick={() => handleAction(movie.telegramCode)}
                        className="flex-1 bg-[#1a1a1a] border border-white/10 text-white py-4 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#222] active:scale-98 transition-all"
                        >
                        <Download size={20} />
                        DOWNLOAD
                        </button>
                    </div>
                    
                    {/* Telegram Join Box (Logo only) */}
                    <div 
                        onClick={() => window.open(channelLink, '_blank')}
                        className="mt-2 w-full p-3 rounded-xl bg-[#0088cc]/10 border border-[#0088cc]/30 flex items-center justify-center cursor-pointer active:scale-98 transition-transform"
                    >
                        <Send size={24} className="text-[#0088cc]" />
                    </div>
                  </div>
                )}

                {/* Tabs for Series */}
                {isSeries && (
                    <div className="flex items-center gap-6 mb-6 border-b border-white/10">
                    <button 
                        onClick={() => setActiveTab('episodes')}
                        className={`pb-3 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'episodes' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Episodes
                    </button>
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 text-xs font-bold tracking-wider uppercase transition-all ${activeTab === 'info' ? 'text-gold border-b-2 border-gold' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        About
                    </button>
                    </div>
                )}

                {/* Content Area */}
                <div className="min-h-[200px]">
                    {isSeries && activeTab === 'episodes' && (
                        <div>
                           {/* Season Selector */}
                           {availableSeasons.length > 0 && (
                               <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                                   {availableSeasons.map(seasonNum => (
                                       <button
                                         key={seasonNum}
                                         onClick={() => setSelectedSeason(seasonNum)}
                                         className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedSeason === seasonNum ? 'bg-gold text-black' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                       >
                                           Season {seasonNum}
                                       </button>
                                   ))}
                               </div>
                           )}

                           <div className="space-y-3">
                              {currentEpisodes.length > 0 ? currentEpisodes.map((ep, index) => (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={ep.id} 
                                    onClick={() => handleAction(ep.telegramCode)}
                                    className="group flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 hover:bg-[#1a1a1a] hover:border-gold/30 cursor-pointer transition-all"
                                  >
                                    <div className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-black/50 overflow-hidden shrink-0">
                                        <img src={movie.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-50 blur-[2px]" />
                                        <Play size={16} fill="white" className="text-white z-10" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className="text-sm font-bold text-gray-200 group-hover:text-gold transition-colors truncate pr-2">
                                                {index + 1}. {ep.title}
                                            </h4>
                                            <span className="text-[10px] font-mono text-gray-500 bg-black px-1.5 rounded">{ep.duration}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 line-clamp-1">Season {ep.season || 1} • Episode {ep.number}</p>
                                    </div>
                                    <div className="p-2 bg-[#0088cc]/10 rounded-full">
                                        <Send size={14} className="text-[#0088cc]" />
                                    </div>
                                  </motion.div>
                              )) : (
                                  <div className="text-center py-8 text-gray-500 text-xs">No episodes in this season</div>
                              )}
                           </div>
                        </div>
                    )}

                    {(!isSeries || activeTab === 'info') && (
                        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                             <p className="text-gray-300 text-sm leading-7 font-medium opacity-90">
                                {movie.description}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Director</span>
                                    <span className="text-xs text-white font-semibold">Unknown</span>
                                </div>
                                <div className="bg-[#111] p-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase block mb-1">Genre</span>
                                    <span className="text-xs text-white font-semibold">{movie.category}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

              </motion.div>
            </div>
        </div>
      </motion.div>
  );
};

export default MovieDetails;