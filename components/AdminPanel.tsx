import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Layout, Settings, LogOut, Trash2, Edit, Plus, Save, Database, RefreshCw, Link, Bot, Star, List, Bell, Eye, EyeOff, TrendingUp, Film, Zap, ToggleLeft, ToggleRight } from 'lucide-react';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, writeBatch, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Movie, Episode } from '../types';
import { INITIAL_MOVIES, BOT_USERNAME } from '../constants';

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [user, setUser] = useState<User | null>(null);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // App Configuration State
  const [botUsername, setBotUsername] = useState('');
  const [channelLink, setChannelLink] = useState('');
  
  // App Features Control
  const [storiesEnabled, setStoriesEnabled] = useState(true);
  const [noticeEnabled, setNoticeEnabled] = useState(true);
  const [noticeText, setNoticeText] = useState('🎬 নতুন মুভি এবং সিরিজ প্রতিদিন আপডেট! 🔥');
  const [bannerAutoPlay, setBannerAutoPlay] = useState(true);

  // Content Management State
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Exclusive');
  const [thumbnail, setThumbnail] = useState('');
  const [telegramCode, setTelegramCode] = useState('');
  const [year, setYear] = useState('2024');
  const [rating, setRating] = useState('9.0');
  const [quality, setQuality] = useState('4K HDR');
  const [description, setDescription] = useState('');
  
  // Content Type & Priority
  const [contentType, setContentType] = useState<'movie' | 'series'>('movie');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTop10, setIsTop10] = useState(false);
  const [priority, setPriority] = useState('5'); // 1-10 priority
  
  // Episode Management State
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [newEpTitle, setNewEpTitle] = useState('');
  const [newEpSeason, setNewEpSeason] = useState('1');
  const [newEpDuration, setNewEpDuration] = useState('');
  const [newEpCode, setNewEpCode] = useState('');
  
  // List State
  const [movieList, setMovieList] = useState<Movie[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch movies
  const fetchMovies = async () => {
    try {
        const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Movie[];
        setMovieList(list);
    } catch (e) {
        console.warn("Error fetching movies:", e);
    }
  };

  // Fetch Settings
  const fetchSettings = async () => {
      try {
          const docRef = doc(db, 'settings', 'config');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              const data = docSnap.data();
              setBotUsername(data.botUsername || BOT_USERNAME);
              setChannelLink(data.channelLink || '');
              setStoriesEnabled(data.storiesEnabled ?? true);
              setNoticeEnabled(data.noticeEnabled ?? true);
              setNoticeText(data.noticeText || '🎬 নতুন মুভি এবং সিরিজ প্রতিদিন আপডেট! 🔥');
              setBannerAutoPlay(data.bannerAutoPlay ?? true);
          } else {
              setBotUsername(BOT_USERNAME);
          }
      } catch (e) {
          console.error("Error fetching settings:", e);
      }
  };

  useEffect(() => {
    if (user) {
        if (activeTab === 'content') fetchMovies();
        if (activeTab === 'settings' || activeTab === 'features') fetchSettings();
    }
  }, [user, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
      await signOut(auth);
  };

  // Reset Form
  const resetForm = () => {
      setTitle('');
      setCategory('Exclusive');
      setThumbnail('');
      setTelegramCode('');
      setYear('2024');
      setRating('9.0');
      setQuality('4K HDR');
      setDescription('');
      setEpisodes([]);
      setNewEpSeason('1');
      setContentType('movie');
      setIsFeatured(false);
      setIsTop10(false);
      setPriority('5');
      setIsEditing(false);
      setEditId(null);
  };

  // Episode Management
  const handleAddEpisode = () => {
      if (!newEpTitle || !newEpCode) return;
      const seasonNum = parseInt(newEpSeason) || 1;
      
      const newEp: Episode = {
          id: Date.now().toString(),
          number: episodes.filter(e => e.season === seasonNum).length + 1,
          season: seasonNum,
          title: newEpTitle,
          duration: newEpDuration || 'N/A',
          telegramCode: newEpCode
      };
      
      const updatedEpisodes = [...episodes, newEp].sort((a, b) => {
          if (a.season !== b.season) return a.season - b.season;
          return a.number - b.number;
      });

      setEpisodes(updatedEpisodes);
      setNewEpTitle('');
      setNewEpDuration('');
      setNewEpCode('');
  };

  const removeEpisode = (id: string) => {
      setEpisodes(episodes.filter(ep => ep.id !== id));
  };

  // Save App Settings
  const handleSaveSettings = async () => {
      setLoading(true);
      try {
          await setDoc(doc(db, 'settings', 'config'), {
              botUsername,
              channelLink,
              storiesEnabled,
              noticeEnabled,
              noticeText,
              bannerAutoPlay
          });
          alert("✅ Settings Saved Successfully!");
      } catch (e) {
          alert("❌ Error saving settings");
      } finally {
          setLoading(false);
      }
  };

  // Publish Content
  const handlePublish = async () => {
      if (!title || !thumbnail) {
          alert('Title and Thumbnail are required!');
          return;
      }

      setLoading(true);
      try {
          const movieData: any = {
              title,
              category,
              thumbnail,
              telegramCode,
              year: parseInt(year),
              rating: parseFloat(rating),
              quality,
              description,
              contentType,
              isFeatured,
              isTop10,
              priority: parseInt(priority),
              createdAt: serverTimestamp()
          };

          if (contentType === 'series' && episodes.length > 0) {
              movieData.episodes = episodes;
          }

          if (isEditing && editId) {
              await updateDoc(doc(db, 'movies', editId), movieData);
              alert('✅ Content Updated!');
          } else {
              await addDoc(collection(db, 'movies'), movieData);
              alert('✅ Content Published!');
          }
          
          resetForm();
          fetchMovies();
      } catch (e) {
          alert('❌ Error publishing content');
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  // Edit Movie
  const handleEdit = (movie: Movie) => {
      setIsEditing(true);
      setEditId(movie.id);
      setTitle(movie.title);
      setCategory(movie.category);
      setThumbnail(movie.thumbnail);
      setTelegramCode(movie.telegramCode);
      setYear(movie.year?.toString() || '2024');
      setRating(movie.rating?.toString() || '9.0');
      setQuality(movie.quality || '4K HDR');
      setDescription(movie.description || '');
      setContentType((movie as any).contentType || 'movie');
      setIsFeatured((movie as any).isFeatured || false);
      setIsTop10((movie as any).isTop10 || false);
      setPriority((movie as any).priority?.toString() || '5');
      setEpisodes(movie.episodes || []);
      setActiveTab('upload');
  };

  // Delete Movie
  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this content?')) return;
      try {
          await deleteDoc(doc(db, 'movies', id));
          fetchMovies();
          alert('✅ Content Deleted!');
      } catch (e) {
          alert('❌ Error deleting content');
      }
  };

  // Seed Demo Data
  const handleSeedData = async () => {
      if (!confirm('Upload demo movies? This will add sample content.')) return;
      setLoading(true);
      try {
          const batch = writeBatch(db);
          INITIAL_MOVIES.forEach((movie) => {
              const docRef = doc(collection(db, 'movies'));
              batch.set(docRef, { ...movie, createdAt: serverTimestamp() });
          });
          await batch.commit();
          fetchMovies();
          alert('✅ Demo data uploaded!');
      } catch (e) {
          alert('❌ Error uploading demo data');
      } finally {
          setLoading(false);
      }
  };

  // Update Content Priority
  const updatePriority = async (id: string, newPriority: number) => {
      try {
          await updateDoc(doc(db, 'movies', id), { priority: newPriority });
          fetchMovies();
      } catch (e) {
          console.error('Error updating priority:', e);
      }
  };

  // Toggle Featured/Top10
  const toggleFeature = async (id: string, field: 'isFeatured' | 'isTop10', currentValue: boolean) => {
      try {
          await updateDoc(doc(db, 'movies', id), { [field]: !currentValue });
          fetchMovies();
      } catch (e) {
          console.error('Error toggling feature:', e);
      }
  };

  // LOGIN SCREEN
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 w-full max-w-md relative"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
            <X size={24} />
          </button>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Settings size={32} className="text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Admin Panel</h2>
            <p className="text-sm text-gray-500">Secure Access Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2 uppercase font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-gold outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    );
  }

  // MAIN ADMIN PANEL
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] overflow-auto"
    >
      <div className="min-h-screen p-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 bg-[#0a0a0a] p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-600 rounded-lg flex items-center justify-center">
                <Settings size={20} className="text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleLogout} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <LogOut size={16} /> Logout
              </button>
              <button onClick={onClose} className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar bg-[#0a0a0a] p-2 rounded-xl border border-white/10">
            {[
              { id: 'upload', label: 'Upload Content', icon: Upload },
              { id: 'content', label: 'Manage Content', icon: List },
              { id: 'features', label: 'App Features', icon: Zap },
              { id: 'settings', label: 'Bot Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gold text-black'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-6">
            
            {/* UPLOAD TAB */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{isEditing ? 'Edit Content' : 'Upload New Content'}</h3>
                  {isEditing && (
                    <button onClick={resetForm} className="text-sm text-gray-400 hover:text-white">
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Content Type */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setContentType('movie')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      contentType === 'movie'
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    <Film size={24} className="mx-auto mb-2" />
                    <div className="font-bold">Movie</div>
                  </button>
                  <button
                    onClick={() => setContentType('series')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      contentType === 'series'
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    <Database size={24} className="mx-auto mb-2" />
                    <div className="font-bold">Series</div>
                  </button>
                </div>

                {/* Feature Toggles */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`p-3 rounded-lg border-2 text-sm font-bold flex items-center justify-center gap-2 ${
                      isFeatured ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    <Star size={16} />
                    Featured
                  </button>
                  <button
                    onClick={() => setIsTop10(!isTop10)}
                    className={`p-3 rounded-lg border-2 text-sm font-bold flex items-center justify-center gap-2 ${
                      isTop10 ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/5 text-gray-400'
                    }`}
                  >
                    <TrendingUp size={16} />
                    Top 10
                  </button>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="p-3 rounded-lg border-2 border-white/10 bg-black text-white text-sm font-bold"
                  >
                    <option value="1">Priority 1 (Highest)</option>
                    <option value="2">Priority 2</option>
                    <option value="3">Priority 3</option>
                    <option value="4">Priority 4</option>
                    <option value="5">Priority 5 (Default)</option>
                    <option value="6">Priority 6</option>
                    <option value="7">Priority 7</option>
                    <option value="8">Priority 8</option>
                    <option value="9">Priority 9</option>
                    <option value="10">Priority 10 (Lowest)</option>
                  </select>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gold uppercase font-bold">Title *</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#111] border border-gold/40 rounded-lg p-3 text-sm focus:border-gold outline-none"
                      placeholder="Movie/Series Title"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gold uppercase font-bold">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm outline-none"
                    >
                      <option>Exclusive</option>
                      <option>Trending</option>
                      <option>Action</option>
                      <option>Comedy</option>
                      <option>Drama</option>
                      <option>Horror</option>
                      <option>Sci-Fi</option>
                      <option>Romance</option>
                      <option>Thriller</option>
                      <option>Documentary</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold">Thumbnail URL *</label>
                    <input
                      value={thumbnail}
                      onChange={(e) => setThumbnail(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm focus:border-gold outline-none"
                      placeholder="https://image-url.com/poster.jpg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold">Description</label>
                    <input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm focus:border-gold outline-none"
                      placeholder="Brief description..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold">Year</label>
                    <input
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm outline-none"
                      placeholder="2024"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-1">
                      <Star size={12} className="text-gold" /> Rating
                    </label>
                    <input
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm outline-none"
                      placeholder="9.0"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold">Quality</label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-sm outline-none"
                    >
                      <option>4K HDR</option>
                      <option>4K</option>
                      <option>Dolby Vision</option>
                      <option>1080p</option>
                      <option>720p</option>
                      <option>WEB-DL</option>
                      <option>HDCam</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gold uppercase font-bold flex items-center gap-1">
                      <Bot size={12} /> Telegram File Code
                    </label>
                    <input
                      value={telegramCode}
                      onChange={(e) => setTelegramCode(e.target.value)}
                      className="w-full bg-[#111] border border-gold/40 rounded-lg p-3 text-sm focus:border-gold outline-none"
                      placeholder={contentType === 'movie' ? 'Movie Code' : 'Series Code (optional)'}
                    />
                  </div>
                </div>

                {/* Episodes (for Series) */}
                {contentType === 'series' && (
                  <div className="bg-[#111] border border-white/5 rounded-xl p-4 space-y-3">
                    <label className="text-xs text-gold uppercase font-bold flex items-center gap-2">
                      <Database size={12} /> Episodes / Seasons
                    </label>

                    <div className="flex gap-2">
                      <div className="w-16 space-y-1">
                        <input
                          value={newEpSeason}
                          onChange={(e) => setNewEpSeason(e.target.value)}
                          placeholder="S1"
                          className="w-full bg-black border border-white/10 rounded p-2 text-xs text-center font-bold"
                        />
                      </div>
                      <input
                        value={newEpTitle}
                        onChange={(e) => setNewEpTitle(e.target.value)}
                        placeholder="Episode Title"
                        className="flex-[2] bg-black border border-white/10 rounded p-2 text-xs"
                      />
                      <input
                        value={newEpDuration}
                        onChange={(e) => setNewEpDuration(e.target.value)}
                        placeholder="42m"
                        className="w-16 bg-black border border-white/10 rounded p-2 text-xs text-center"
                      />
                      <input
                        value={newEpCode}
                        onChange={(e) => setNewEpCode(e.target.value)}
                        placeholder="Telegram Code"
                        className="flex-1 bg-black border border-gold/30 rounded p-2 text-xs text-gold"
                      />
                      <button
                        onClick={handleAddEpisode}
                        className="bg-white/10 hover:bg-gold hover:text-black p-2 rounded transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {episodes.length > 0 && (
                      <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                        {episodes.map((ep) => (
                          <div
                            key={ep.id}
                            className="flex items-center justify-between bg-black/50 p-2 rounded border border-white/5 text-xs group hover:border-gold/30"
                          >
                            <div className="flex items-center gap-2">
                              <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-gray-400">
                                S{ep.season}
                              </span>
                              <span className="text-gray-300 font-bold">
                                {ep.number}. {ep.title}
                              </span>
                              <span className="text-gray-500">({ep.duration})</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gold font-mono text-[10px]">{ep.telegramCode}</span>
                              <button
                                onClick={() => removeEpisode(ep.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full bg-gold text-black font-bold py-4 rounded-xl mt-4 hover:bg-yellow-500 shadow-lg flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {loading ? 'Processing...' : isEditing ? 'UPDATE CONTENT' : 'PUBLISH NOW'}
                </button>
              </div>
            )}

            {/* MANAGE CONTENT TAB */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Manage Library ({movieList.length})</h3>
                  <button
                    onClick={handleSeedData}
                    className="text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded flex items-center gap-2 border border-white/10"
                  >
                    <RefreshCw size={12} /> Upload Demo Data
                  </button>
                </div>

                <div className="grid gap-3">
                  {movieList.map((movie) => (
                    <div
                      key={movie.id}
                      className="flex items-center gap-4 bg-[#111] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors group"
                    >
                      <img src={movie.thumbnail} className="w-12 h-16 object-cover rounded" alt={movie.title} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{movie.title}</h4>
                        <div className="flex gap-2 text-[10px] text-gray-400 flex-wrap">
                          <span>{movie.category}</span>
                          <span>•</span>
                          <span>{movie.rating} ★</span>
                          {(movie as any).isFeatured && (
                            <>
                              <span>•</span>
                              <span className="text-purple-400">Featured</span>
                            </>
                          )}
                          {(movie as any).isTop10 && (
                            <>
                              <span>•</span>
                              <span className="text-red-400">Top 10</span>
                            </>
                          )}
                          {(movie as any).priority && (
                            <>
                              <span>•</span>
                              <span>P{(movie as any).priority}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFeature(movie.id, 'isFeatured', (movie as any).isFeatured || false)}
                          className={`p-2 rounded-lg ${
                            (movie as any).isFeatured
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star size={16} />
                        </button>
                        <button
                          onClick={() => toggleFeature(movie.id, 'isTop10', (movie as any).isTop10 || false)}
                          className={`p-2 rounded-lg ${
                            (movie as any).isTop10
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                          title="Toggle Top 10"
                        >
                          <TrendingUp size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(movie)}
                          className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(movie.id)}
                          className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {movieList.length === 0 && (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    No content in database. Use "Upload Demo Data" to get started.
                  </div>
                )}
              </div>
            )}

            {/* APP FEATURES TAB */}
            {activeTab === 'features' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">App Features Control</h3>

                {/* Stories Control */}
                <div className="bg-[#111] p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        <Zap size={16} className="text-gold" />
                        Stories Feature
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Instagram-style story circles on homepage
                      </p>
                    </div>
                    <button
                      onClick={() => setStoriesEnabled(!storiesEnabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        storiesEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {storiesEnabled ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  <div className="text-xs text-gray-400">
                    Status: <span className={storiesEnabled ? 'text-green-400' : 'text-red-400'}>
                      {storiesEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {/* Notice Bar Control */}
                <div className="bg-[#111] p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        <Bell size={16} className="text-gold" />
                        Notice Bar
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Announcement banner on homepage</p>
                    </div>
                    <button
                      onClick={() => setNoticeEnabled(!noticeEnabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        noticeEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {noticeEnabled ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  {noticeEnabled && (
                    <input
                      value={noticeText}
                      onChange={(e) => setNoticeText(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white mt-3"
                      placeholder="Enter notice text..."
                    />
                  )}
                </div>

                {/* Banner Auto-play */}
                <div className="bg-[#111] p-4 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white flex items-center gap-2">
                        <Film size={16} className="text-gold" />
                        Banner Auto-Change
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Auto-rotate featured content banner
                      </p>
                    </div>
                    <button
                      onClick={() => setBannerAutoPlay(!bannerAutoPlay)}
                      className={`p-2 rounded-lg transition-colors ${
                        bannerAutoPlay ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {bannerAutoPlay ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="w-full bg-gold text-black font-bold py-3 rounded-xl hover:bg-yellow-500 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {loading ? 'Saving...' : 'Save Features Settings'}
                </button>
              </div>
            )}

            {/* BOT SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">Bot Configuration</h3>

                <div className="bg-[#111] p-4 rounded-xl border border-white/10 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gold uppercase font-bold flex items-center gap-2">
                      <Bot size={14} /> Telegram Bot Username
                    </label>
                    <input
                      value={botUsername}
                      onChange={(e) => setBotUsername(e.target.value.replace('@', ''))}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-gold outline-none"
                      placeholder="e.g. Cineflix_Streembot"
                    />
                    <p className="text-[10px] text-gray-500">
                      Do not include '@'. This bot handles the file delivery.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 uppercase font-bold flex items-center gap-2">
                      <Link size={14} /> Main Channel Link
                    </label>
                    <input
                      value={channelLink}
                      onChange={(e) => setChannelLink(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-gold outline-none"
                      placeholder="https://t.me/yourchannel"
                    />
                    <p className="text-[10px] text-gray-500">Link for the 'Join Channel' buttons.</p>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> {loading ? 'Saving...' : 'Save Configuration'}
                  </button>
                </div>

                <div className="p-4 bg-gold/5 rounded-xl border border-gold/10">
                  <h4 className="text-gold text-sm font-bold mb-2">How Deep Linking Works</h4>
                  <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                    <li>Go to your Telegram Bot ({botUsername || 'your_bot'}) and upload a file.</li>
                    <li>Get the unique ID or Start Parameter for that file (e.g. batch_123).</li>
                    <li>
                      In the <strong>Upload Tab</strong>, paste <strong>ONLY</strong> that ID into the{' '}
                      <strong>Telegram File Code</strong> field.
                    </li>
                    <li>
                      The app automatically generates: t.me/{botUsername}?start={'{telegramCode}'}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
