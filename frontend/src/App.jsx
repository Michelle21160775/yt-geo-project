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
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openChannelModal = (channel) => {
        setSelectedChannel(channel);
        setIsModalOpen(true);
    };

    const closeChannelModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedChannel(null), 300);
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

                {/* Results Grid */}
                {videos.length > 0 && (
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Resultados ({videos.length})</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {videos.map((item, idx) => {
                                // Video card
                                if (item.id && item.id.kind === 'youtube#video' && item.id.videoId) {
                                    return (
                                        <div key={item.id.videoId} className="bg-[#1a1a24] rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all group">
                                            <div className="relative aspect-video">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${item.id.videoId}`}
                                                    title={item.snippet.title}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    className="absolute inset-0"
                                                ></iframe>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                                        Video
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-medium line-clamp-2 text-gray-200 group-hover:text-purple-300 transition-colors">
                                                    {item.snippet.title}
                                                </h3>
                                            </div>
                                        </div>
                                    );
                                }
                                // Channel card
                                else if (item.id && item.id.kind === 'youtube#channel' && item.id.channelId) {
                                    return (
                                        <div
                                            key={item.id.channelId}
                                            onClick={() => openChannelModal(item)}
                                            className="bg-[#1a1a24] rounded-xl overflow-hidden border border-pink-500/30 hover:border-pink-500/70 transition-all cursor-pointer group"
                                        >
                                            <div className="relative aspect-video bg-gradient-to-br from-pink-900/30 to-purple-900/30">
                                                <img
                                                    src={item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url}
                                                    alt={item.snippet.title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <div className="bg-pink-500/90 backdrop-blur-sm rounded-full p-2">
                                                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs rounded-full flex items-center gap-1">
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                                        </svg>
                                                        Canal
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-medium line-clamp-2 text-gray-200 group-hover:text-pink-300 transition-colors">
                                                    {item.snippet.title}
                                                </h3>
                                                {item.snippet.description && (
                                                    <p className="text-xs text-gray-400 line-clamp-2 mt-2">
                                                        {item.snippet.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
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

            {/* Channel Modal */}
            {isModalOpen && selectedChannel && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={closeChannelModal}
                >
                    <div
                        className="bg-[#1a1a24] rounded-2xl border border-pink-500/50 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative">
                            <div className="h-48 bg-gradient-to-br from-pink-900/50 to-purple-900/50 rounded-t-2xl overflow-hidden">
                                <img
                                    src={selectedChannel.snippet.thumbnails?.high?.url || selectedChannel.snippet.thumbnails?.medium?.url}
                                    alt={selectedChannel.snippet.title}
                                    className="w-full h-full object-cover opacity-50"
                                />
                            </div>
                            <button
                                onClick={closeChannelModal}
                                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            {/* Channel Avatar */}
                            <div className="absolute -bottom-12 left-8">
                                <img
                                    src={selectedChannel.snippet.thumbnails?.medium?.url || selectedChannel.snippet.thumbnails?.default?.url}
                                    alt={selectedChannel.snippet.title}
                                    className="w-24 h-24 rounded-full border-4 border-[#1a1a24] shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 pt-16">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-white">
                                            {selectedChannel.snippet.title}
                                        </h2>
                                        <span className="px-3 py-1 bg-pink-500/20 text-pink-300 text-sm rounded-full flex items-center gap-1">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                                            </svg>
                                            Canal
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                        {selectedChannel.snippet.channelTitle}
                                    </p>
                                </div>
                            </div>

                            {/* Channel Description */}
                            {selectedChannel.snippet.description && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Descripción</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">
                                        {selectedChannel.snippet.description}
                                    </p>
                                </div>
                            )}

                            {/* Channel Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {selectedChannel.snippet.publishedAt && (
                                    <div className="bg-[#0a0a0a] rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                            <span>Creado el</span>
                                        </div>
                                        <p className="text-white font-medium">
                                            {new Date(selectedChannel.snippet.publishedAt).toLocaleDateString('es-MX', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <a
                                    href={`https://www.youtube.com/channel/${selectedChannel.id.channelId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                    Ver en YouTube
                                </a>
                                <button
                                    onClick={closeChannelModal}
                                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
