import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Zap, Send, Sparkles, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot, doc, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

import { Movie, Category, AppSettings } from './types';
import { INITIAL_MOVIES, CATEGORIES, BOT_USERNAME } from './constants';

import MovieCard from './components/MovieCard';
import Sidebar from './components/Sidebar';
import MovieDetails from './components/MovieDetails';
import Banner from './components/Banner';
import StoryCircle from './components/StoryCircle';
import TrendingRow from './components/TrendingRow';
import StoryViewer from './components/StoryViewer';
import BottomNav from './components/BottomNav';
import Explore from './components/Explore';
import Watchlist from './components/Watchlist';
import NoticeBar from './components/NoticeBar';
import SplashScreen from './components/SplashScreen';
import AdminPanel from './components/AdminPanel';

type Tab = 'home' | 'search' | 'favorites';

const App: React.FC = () => {
  // Loading State
  const [isLoading, setIsLoading] = useState(true);

  // State
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings>({
      botUsername: BOT_USERNAME, // Defaults to 'Cinaflix_Streembot'
      channelLink: 'https://t.me/cineflixrequestcontent'
  });
  
  // Navigation & Scroll State
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  
  // Secret Admin Access
  const [tapCount, setTapCount] = useState(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Category State
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  // Story State
  const [viewingStory, setViewingStory] = useState<Movie | null>(null);
  
  // Banner State
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Initialize & Fetch Data
  useEffect(() => {
    // 1. Fetch Movies from Firestore (OPTIMIZED: Only load latest 50 to prevent crash with 1000s of items)
    // Full search is handled in Explore component
    const q = query(collection(db, 'movies'), orderBy('createdAt', 'desc'), limit(50));
    
    const unsubscribeMovies = onSnapshot(q, (snapshot) => {
      const fetchedMovies = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Movie[];
      
      // If DB is empty, use initial data, otherwise use fetched
      setMovies(fetchedMovies.length > 0 ? fetchedMovies : INITIAL_MOVIES);
    }, (error) => {
      console.warn("Firestore access failed (using offline mode):", error);
      // Fallback to initial data if Firestore fails (e.g., DB not created)
      setMovies(INITIAL_MOVIES);
    });

    // 2. Fetch Settings from Firestore
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'config'), (doc) => {
        if (doc.exists()) {
            setAppSettings(doc.data() as AppSettings);
        }
    }, (error) => {
       console.warn("Settings fetch failed:", error);
    });

    // 3. Handle Splash Screen
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2500);

    // 4. Load Favorites
    const savedFavs = localStorage.getItem('cine_favs');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    // 5. Telegram Config
    // @ts-ignore
    if (window.Telegram?.WebApp) {
        // @ts-ignore
        window.Telegram.WebApp.expand();
        // @ts-ignore
        window.Telegram.WebApp.setHeaderColor('#000000');
        // @ts-ignore
        window.Telegram.WebApp.setBackgroundColor('#000000');
    }

    return () => {
      clearTimeout(timer);
      unsubscribeMovies();
      unsubscribeSettings();
    };
  }, []);

  // Scroll Handling for Bottom Nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Always show at top
      if (currentScrollY < 50) {
        setIsNavVisible(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      // Hide on scroll down, Show on scroll up
      if (currentScrollY > lastScrollY.current + 20) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY.current - 20) {
        setIsNavVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logic
  const handleMovieClick = (movie: Movie) => {
      setSelectedMovie(movie);
  };

  const handleStoryClick = (movie: Movie) => {
      setViewingStory(movie);
  };

  const handleSurpriseMe = () => {
      if (movies.length === 0) return;
      const randomMovie = movies[Math.floor(Math.random() * movies.length)];
      setSelectedMovie(randomMovie);
      // @ts-ignore
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success');
  };

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavs);
    localStorage.setItem('cine_favs', JSON.stringify(newFavs));
    
    // @ts-ignore
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
  };

  // Banner Logic
  const featuredMovies = useMemo(() => {
    return movies.filter(m => m.category === 'Exclusive' || m.rating > 8.5).slice(0, 5);
  }, [movies]);

  useEffect(() => {
    if (featuredMovies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [featuredMovies]);

  // Filter Logic for Home
  const displayedMovies = useMemo(() => {
     let filtered = movies;
     if (activeCategory !== 'All') {
         filtered = filtered.filter(m => m.category === activeCategory);
     }
     return activeCategory === 'All' ? filtered.slice(0, 12) : filtered;
  }, [movies, activeCategory]);

  const favMovies = useMemo(() => movies.filter(m => favorites.includes(m.id)), [movies, favorites]);

  // --- RENDER ---

  if (isLoading) {
      return <SplashScreen />;
  }

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-black text-white font-sans selection:bg-gold selection:text-black pb-24"
    >
      
      {/* --- HEADER --- */}
      {activeTab === 'home' && (
        <header className={`fixed top-0 inset-x-0 z-50 px-4 py-4 flex justify-between items-center transition-all duration-300 ${!isNavVisible ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-lg' : 'bg-gradient-to-b from-black/90 to-transparent'}`}>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-brand text-4xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#fff] to-gold cursor-pointer drop-shadow-[0_2px_10px_rgba(255,215,0,0.3)]"
              animate={{ 
                scale: tapCount > 0 ? [1, 1.05, 1] : 1,
                filter: tapCount > 0 ? `brightness(${1 + tapCount * 0.1})` : 'brightness(1)'
              }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                  // Secret Admin Access: 10 taps within 5 seconds
                  const newCount = tapCount + 1;
                  setTapCount(newCount);
                  
                  // Clear previous timer
                  if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
                  
                  // Reset tap count after 5 seconds
                  tapTimerRef.current = setTimeout(() => setTapCount(0), 5000);
                  
                  // Open admin panel on 10th tap
                  if (newCount >= 10) {
                      setTapCount(0);
                      setIsAdminOpen(true);
                      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
                  } else {
                      // Normal behavior: scroll to top
                      setActiveTab('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
              }}
            >
              CINEFLIX
            </motion.div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => window.open('https://t.me/cineflixrequestcontent', '_blank')}
                  className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-all text-white hover:bg-[#0088cc] hover:border-[#0088cc]"
                >
                    <Send size={18} className="-ml-0.5 mt-0.5" />
                </button>

                <button 
                  onClick={handleSurpriseMe}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/10 to-purple-500/10 backdrop-blur-md flex items-center justify-center border border-gold/20 active:scale-95 transition-all text-gold animate-pulse-gold"
                >
                    <Sparkles size={18} />
                </button>

                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-all text-white hover:bg-gold hover:border-gold"
                >
                    <Menu size={18} />
                </button>
            </div>
        </header>
      )}

      {/* --- BANNER (FULL WIDTH) --- */}
      {activeTab === 'home' && featuredMovies.length > 0 && (
          <div className="relative z-0">
             <Banner 
                movie={featuredMovies[currentBannerIndex]} 
                onClick={handleMovieClick}
                onPlay={handleMovieClick} 
             />
          </div>
      )}

      {/* --- CONTENT AREA --- */}
      <main className={`px-4 max-w-7xl mx-auto relative z-10 ${activeTab === 'home' ? '-mt-10' : 'pt-20'}`}>
        
        {/* HOME VIEW */}
        {activeTab === 'home' && (
            <>  
                {/* 1. Trending (Moved Up) */}
                <TrendingRow movies={[...movies].sort((a,b) => b.rating - a.rating)} onClick={handleMovieClick} />

                {/* 2. Story Circles (Moved Below Trending) */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Zap size={14} className="text-gold fill-gold animate-pulse" />
                        <span className="text-xs font-bold text-gray-300 tracking-wider uppercase">Latest Stories</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {movies.slice(0, 4).map((movie, index) => (
                            <StoryCircle 
                                key={movie.id} 
                                movie={movie} 
                                index={index} 
                                onClick={handleStoryClick} 
                            />
                        ))}
                    </div>
                </div>

                {/* 3. Bengali Notice Bar (Moved Below Stories) */}
                <NoticeBar />

                {/* Premium Category Filter */}
                <div className="sticky top-[60px] z-30 bg-black/95 backdrop-blur-xl -mx-4 px-4 py-4 mb-6 border-b border-white/5 shadow-2xl">
                   <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar px-1">
                       {CATEGORIES.map((cat) => {
                           const isActive = activeCategory === cat;
                           return (
                               <button
                                 key={cat}
                                 onClick={() => setActiveCategory(cat as Category)}
                                 className="relative px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all shrink-0 overflow-hidden"
                               >
                                   {isActive && (
                                       <motion.div 
                                          layoutId="activeCategory"
                                          className="absolute inset-0 bg-gradient-to-r from-gold to-[#ffe55c] rounded-xl z-0"
                                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                       />
                                   )}
                                   <span className={`relative z-10 flex items-center gap-1.5 ${isActive ? 'text-black font-extrabold' : 'text-gray-400 font-medium'}`}>
                                       {cat}
                                       {isActive && <Sparkles size={10} className="fill-black/20 text-black/40" />}
                                   </span>
                                   {!isActive && (
                                       <div className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors" />
                                   )}
                               </button>
                           )
                       })}
                   </div>
                </div>

                {/* Filtered Grid */}
                <div className="pb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-gold rounded-full shadow-[0_0_10px_#FFD700]"></span>
                        {activeCategory === 'All' ? 'Just Added' : `${activeCategory} Collection`}
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                        <AnimatePresence mode="popLayout">
                            {displayedMovies.length > 0 ? (
                                displayedMovies.map((movie) => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        isFavorite={favorites.includes(movie.id)}
                                        onToggleFavorite={toggleFavorite}
                                        onClick={handleMovieClick}
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-10 text-gray-500 text-xs">
                                    {movies.length === 0 ? "Loading Content..." : "No content found."}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </>
        )}

        {/* SEARCH / EXPLORE VIEW */}
        {activeTab === 'search' && (
             <Explore 
                movies={movies} 
                onMovieClick={handleMovieClick} 
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onBack={() => setActiveTab('home')}
             />
        )}

        {/* WATCHLIST VIEW */}
        {activeTab === 'favorites' && (
             <div className="pt-4">
                <Watchlist 
                    movies={favMovies} 
                    onRemove={toggleFavorite} 
                    onClick={handleMovieClick} 
                />
             </div>
        )}

      </main>

      {/* --- BOTTOM NAV --- */}
      <BottomNav 
        activeTab={activeTab} 
        isVisible={isNavVisible}
        onTabChange={setActiveTab} 
      />

      {/* --- OVERLAYS --- */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onSurprise={handleSurpriseMe}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <AnimatePresence>
        {selectedMovie && (
          <MovieDetails 
            movie={selectedMovie} 
            onClose={() => setSelectedMovie(null)} 
            botUsername={appSettings.botUsername}
            channelLink={appSettings.channelLink}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewingStory && (
            <StoryViewer 
                movie={viewingStory} 
                onClose={() => setViewingStory(null)} 
                isFavorite={favorites.includes(viewingStory.id)}
                onToggleFavorite={toggleFavorite}
                onNavigateToMovie={(m) => {
                    setViewingStory(null); 
                    setTimeout(() => setSelectedMovie(m), 300); 
                }}
            />
        )}
      </AnimatePresence>
      
      {isAdminOpen && (
          <AdminPanel onClose={() => setIsAdminOpen(false)} />
      )}

    </motion.div>
  );
};

export default App;