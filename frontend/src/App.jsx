import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

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

function App({ user, onLogout }) {
    const [location, setLocation] = useState(null);
    const [query, setQuery] = useState('');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleSearch = async () => {
        if (!location) return setError('Aún no tenemos tu ubicación.');
        if (!query) return setError('Por favor, escribe algo para buscar.');

        setLoading(true);
        setError('');
        setVideos([]);

        try {
            const response = await axios.post('http://localhost:3001/api/search', {
                query,
                lat: location.lat,
                lon: location.lon,
            });
            setVideos(response.data);
            console.log(response.data);
        } catch (err) {
            setError('Hubo un error al buscar. Intenta de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
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
                                <span className="hidden md:block text-sm text-gray-400">{user?.email}</span>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <LogoutIcon />
                                    <span className="hidden sm:inline">Salir</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Section */}
                <div className="mb-8">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">
                            Encuentra Videos Cerca de Ti
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Descubre contenido geo-localizado en los Valles Centrales
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ej: Guelaguetza, Tlayudas, Monte Albán..."
                                    className="w-full px-5 py-4 bg-[#1a1a24] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={!location || loading}
                                className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SearchIcon />
                                <span className="hidden sm:inline">{loading ? 'Buscando...' : 'Buscar'}</span>
                            </button>
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                                <p className="text-red-300 text-sm text-center">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Grid */}
                {videos.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Resultados ({videos.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {videos.map((video, idx) => {
                                if (video.id && video.id.kind === 'youtube#video' && video.id.videoId) {
                                    return (
                                        <div key={video.id.videoId} className="bg-[#1a1a24] rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all group">
                                            <div className="relative aspect-video">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                                    title={video.snippet.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0"
                                                ></iframe>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-sm font-medium line-clamp-2 text-gray-200 group-hover:text-purple-300 transition-colors">
                                                    {video.snippet.title}
                                                </h3>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={video.id.channelId || idx} className="bg-[#1a1a24] rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                                            <a href={`https://www.youtube.com/channel/${video.id.channelId || ''}`} target="_blank" rel="noopener noreferrer">
                                                <div className="relative aspect-video">
                                                    <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-sm font-medium line-clamp-2 text-gray-200 hover:text-purple-300 transition-colors">
                                                        {video.snippet.title}
                                                    </h3>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && videos.length === 0 && query === '' && (
                    <div className="text-center py-16">
                        <div className="inline-flex p-6 bg-purple-500/10 rounded-full mb-4">
                            <SearchIcon className="w-12 h-12 text-purple-300" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            Comienza tu búsqueda
                        </h3>
                        <p className="text-gray-500">
                            Ingresa un término de búsqueda para encontrar videos cerca de ti
                        </p>
                    </div>
                )}

                {/* No Results */}
                {!loading && videos.length === 0 && query !== '' && (
                    <div className="text-center py-16">
                        <div className="inline-flex p-6 bg-gray-500/10 rounded-full mb-4">
                            <SearchIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            No se encontraron resultados
                        </h3>
                        <p className="text-gray-500">
                            Intenta con otros términos de búsqueda
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
