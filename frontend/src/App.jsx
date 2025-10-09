import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchControls from './components/SearchControls';
import ResultsDisplay from './components/ResultsDisplay';
import FloatingPlayer from './components/FloatingPlayer';
import ChannelDetailModal from './components/ChannelDetailModal';
import WatchPage from './components/WatchPage';
import './styles/scrollbar.css';

const LogoutIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const FavoritesIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

function App({ user, onLogout }) {
    const [location, setLocation] = useState(null);
    const [query, setQuery] = useState('');
    const [radius, setRadius] = useState('50km');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState(null);
    const [currentVideoInfo, setCurrentVideoInfo] = useState(null);
    const [isPlayerMinimized, setIsPlayerMinimized] = useState(false);
    const [showWatchPage, setShowWatchPage] = useState(false);
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Function to get user initials
    const getUserInitials = (email) => {
        if (!email) return 'U';
        const parts = email.split('@')[0].split('.');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        } else {
            return email.substring(0, 2).toUpperCase();
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            setLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
            });
            setError('');
        }, () => {
            setError('No se pudo obtener tu ubicación. Por favor, actívala.');
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && !event.target.closest('.relative')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleSearch = async () => {
        if (!location) return setError('Aún no tenemos tu ubicación.');
        if (!query) return setError('Por favor, escribe algo para buscar.');

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const response = await axios.post('http://localhost:3001/api/search', {
                query,
                lat: location.lat,
                lon: location.lon,
                radius: radius,
                regionCode: 'MX'
            });
            
            setResults(response.data.results);
            console.log('Search results:', response.data);
        } catch (err) {
            setError('Hubo un error al buscar. Intenta de nuevo más tarde.');
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVideoClick = (videoId, videoInfo = null) => {
        setCurrentVideoId(videoId);
        setCurrentVideoInfo(videoInfo);
        setShowWatchPage(true);
        setIsPlayerMinimized(false);
        
        // Get recommended videos (other videos from current search results)
        if (results) {
            const allVideos = [
                ...(results.other_videos || []),
                ...(results.related_channels || []).flatMap(channel => channel.videos || [])
            ];
            // Filter out current video, ensure unique IDs, and get random recommendations
            const filtered = allVideos
                .filter(v => v && v.video_id && v.video_id !== videoId)
                .filter((video, index, self) => 
                    index === self.findIndex(v => v.video_id === video.video_id)
                );
            setRecommendedVideos(filtered.slice(0, 10)); // Limit to 10 recommendations
        }
    };

    const handleChannelClick = (channel) => {
        setSelectedChannel(channel);
        setIsChannelModalOpen(true);
    };

    const handleMinimizeFromWatch = () => {
        setShowWatchPage(false);
        setIsPlayerMinimized(false);
        // Keep video playing in floating player
    };

    const handleExpandFromFloating = () => {
        setShowWatchPage(true);
    };

    const handleVideoSelectFromWatch = (videoId, videoInfo) => {
        // Switch to new video in watch page
        setCurrentVideoId(videoId);
        setCurrentVideoInfo(videoInfo);
        
        // Update recommended videos
        if (results) {
            const allVideos = [
                ...(results.other_videos || []),
                ...(results.related_channels || []).flatMap(channel => channel.videos || [])
            ];
            const filtered = allVideos
                .filter(v => v && v.video_id && v.video_id !== videoId)
                .filter((video, index, self) => 
                    index === self.findIndex(v => v.video_id === video.video_id)
                );
            setRecommendedVideos(filtered.slice(0, 10));
        }
    };

    const handleAddToFavorites = (videoId) => {
        // TODO: Implement favorites functionality
        console.log('Add to favorites:', videoId);
    };

    const closeChannelModal = () => {
        setIsChannelModalOpen(false);
        setTimeout(() => setSelectedChannel(null), 300);
    };

    const closeWatchPage = () => {
        setShowWatchPage(false);
        setCurrentVideoId(null);
        setCurrentVideoInfo(null);
        setRecommendedVideos([]);
        setIsPlayerMinimized(false);
    };

    const closeFloatingPlayer = () => {
        setCurrentVideoId(null);
        setCurrentVideoInfo(null);
        setIsPlayerMinimized(false);
    };

    const togglePlayerMinimize = () => {
        setIsPlayerMinimized(!isPlayerMinimized);
    };

    const handleProfileClick = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    const handleFavoritesClick = () => {
        // Por ahora solo console.log, posteriormente será la navegación a favoritos
        console.log('Clicked Favorites button');
    };

    return (
        <>
            {/* Watch Page */}
            {showWatchPage && currentVideoId && (
                <WatchPage
                    videoId={currentVideoId}
                    videoInfo={currentVideoInfo}
                    recommendedVideos={recommendedVideos}
                    onVideoSelect={handleVideoSelectFromWatch}
                    onMinimize={handleMinimizeFromWatch}
                    onClose={closeWatchPage}
                    onAddToFavorites={handleAddToFavorites}
                />
            )}

            {/* Main Application */}
            <div className={`min-h-screen bg-[#0a0a0a] text-white custom-scrollbar ${showWatchPage ? 'hidden' : ''}`}>
            {/* Header */}
            <header className="bg-[#1a1a24]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M23 7l-7 5 7 5V7z"></path>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                    Video Finder
                                </h1>
                                <p className="text-xs text-gray-400">Geo-localizado en Oaxaca</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm text-purple-300/70">
                                <MapPinIcon />
                                <span>{location ? 'Ubicación detectada' : 'Buscando ubicación...'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Profile dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={handleProfileClick}
                                        className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors text-white font-medium text-sm"
                                        title="Perfil"
                                    >
                                        {getUserInitials(user?.email)}
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {isProfileDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#1a1a24] border border-white/10 rounded-lg shadow-lg z-50">
                                            <div className="py-2">
                                                <div className="px-4 py-2 text-sm text-gray-400 border-b border-white/10">
                                                    {user?.email}
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileDropdownOpen(false);
                                                        console.log('Navigate to Profile');
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                                                >
                                                    <ProfileIcon />
                                                    Perfil
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsProfileDropdownOpen(false);
                                                        onLogout();
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                                                >
                                                    <LogoutIcon />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <button
                                    onClick={handleFavoritesClick}
                                    className="p-2 bg-pink-600/20 hover:bg-pink-600/30 rounded-lg transition-colors"
                                    title="Favoritos"
                                >
                                    <FavoritesIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <SearchControls
                    query={query}
                    setQuery={setQuery}
                    radius={radius}
                    setRadius={setRadius}
                    onSearch={handleSearch}
                    loading={loading}
                    location={location}
                    error={error}
                />

                {/* Results */}
                {results && (
                    <ResultsDisplay
                        results={results}
                        searchTerm={query}
                        geolocation={{ lat: location?.lat, lon: location?.lon, radius }}
                        onVideoClick={handleVideoClick}
                        onChannelClick={handleChannelClick}
                    />
                )}

                {/* Empty State */}
                {!loading && !results && query === '' && (
                    <div className="text-center py-16">
                        <div className="inline-flex p-6 bg-purple-500/10 rounded-full mb-4">
                            <svg className="w-12 h-12 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            Comienza tu búsqueda
                        </h3>
                        <p className="text-gray-500">
                            Ingresa un término de búsqueda para encontrar videos cerca de ti
                        </p>
                    </div>
                )}
            </main>

            {/* Channel Detail Modal */}
            <ChannelDetailModal
                channel={selectedChannel}
                isOpen={isChannelModalOpen}
                onClose={closeChannelModal}
                onVideoClick={handleVideoClick}
                location={location}
                radius={radius}
            />

            {/* Floating Player - only show when NOT in watch page */}
            {currentVideoId && !showWatchPage && (
                <FloatingPlayer
                    videoId={currentVideoId}
                    videoInfo={currentVideoInfo}
                    onClose={closeFloatingPlayer}
                    isMinimized={isPlayerMinimized}
                    onToggleMinimize={togglePlayerMinimize}
                    onExpand={handleExpandFromFloating}
                />
            )}
            </div>
        </>
    );
}

export default App;
