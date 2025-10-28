import React, { useState, useEffect, useRef } from 'react';
import { fetchAllComments, getCommentCount, addComment } from '../utils/commentsAPI';

const FeedbackPage = ({ onClose, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentCount, setCommentCount] = useState(0);
    const chatContainerRef = useRef(null);
    
    // User info modal state
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);

    // Chat input state
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState('');
    // Sender's full name (required) — pre-fill from currentUser.name if available
    const [fullName, setFullName] = useState(currentUser?.name || '');

    // Load comments
    const loadComments = async () => {
        setLoading(true);
        setError('');

        try {
            const [commentsData, count] = await Promise.all([
                fetchAllComments(),
                getCommentCount()
            ]);

            // Reverse the order so newest comments appear first
            setComments([...commentsData].reverse());
            setCommentCount(count);
        } catch (err) {
            console.error('Error loading comments:', err);
            setError('Error al cargar los comentarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();

        // Auto-refresh every 30 seconds for real-time feel
        const interval = setInterval(loadComments, 30000);

        return () => clearInterval(interval);
    }, []);

    // keep fullName synced if currentUser changes (only sync name)
    useEffect(() => {
        setFullName(currentUser?.name || '');
    }, [currentUser]);

    // Auto-scroll to top when new comments arrive
    useEffect(() => {
        if (chatContainerRef.current && comments.length > 0) {
            chatContainerRef.current.scrollTop = 0;
        }
    }, [comments]);

    // Format date like Twitch (relative time)
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'ahora mismo';
        if (diffMins < 60) return `hace ${diffMins}m`;
        if (diffHours < 24) return `hace ${diffHours}h`;
        if (diffDays < 7) return `hace ${diffDays}d`;

        return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
    };

    // Get initials or first letter for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Handle sending a new message
    const handleSendMessage = async (e) => {
        e.preventDefault();

        // Validate full name is provided
        if (!fullName || !fullName.trim()) {
            setSendError('Por favor, ingresa tu nombre completo');
            setTimeout(() => setSendError(''), 3000);
            return;
        }

        if (!newMessage.trim()) {
            setSendError('No puedes enviar un mensaje vacío');
            setTimeout(() => setSendError(''), 3000);
            return;
        }

        if (newMessage.length > 1000) {
            setSendError('El mensaje es muy largo (máximo 1000 caracteres)');
            setTimeout(() => setSendError(''), 3000);
            return;
        }

        setIsSending(true);
        setSendError('');

        try {
            // Use the provided fullName as the commenter name (required)
            const userName = fullName.trim();

            const commentData = {
                userName: userName,
                userEmail: currentUser?.email || null,
                comment: newMessage.trim()
            };

            const newComment = await addComment(commentData);

            // Add the new comment to the beginning of the list (newest first)
            setComments(prev => [{
                id: newComment.id,
                userName: newComment.userName,
                userEmail: newComment.userEmail,
                userId: newComment.userId,
                comment: newComment.comment,
                createdAt: newComment.createdAt,
                updatedAt: newComment.updatedAt
            }, ...prev]);

            // Update comment count
            setCommentCount(prev => prev + 1);

            // Clear input
            setNewMessage('');

            // Scroll to top to show the new comment
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = 0;
                }
            }, 100);

        } catch (err) {
            console.error('Error sending message:', err);
            setSendError(err.message || 'Error al enviar el mensaje');
            setTimeout(() => setSendError(''), 5000);
        } finally {
            setIsSending(false);
        }
    };

    // Handle keyboard shortcuts (Enter to send, Shift+Enter for new line)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Generate avatar color based on name
    const getAvatarColor = (name) => {
        if (!name) return 'bg-gray-500';

        const colors = [
            'bg-purple-500',
            'bg-pink-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-red-500',
            'bg-indigo-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-cyan-500'
        ];

        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    };

    // Handle avatar click to show user info
    const handleAvatarClick = (comment) => {
        setSelectedUser({
            name: comment.userName || 'Anónimo',
            email: comment.userEmail || 'No disponible',
            userId: comment.userId,
            isCurrentUser: comment.userId === currentUser?.id
        });
        setShowUserModal(true);
    };

    // Close user modal
    const closeUserModal = () => {
        setShowUserModal(false);
        setTimeout(() => setSelectedUser(null), 300);
    };

    return (
        <div className="fixed inset-0 bg-[#0e0e1a] z-50 flex flex-col">
            {/* Header */}
            <div className="bg-[#1a1a24] border-b border-purple-600/30 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onClose}
                        className="text-purple-300 hover:text-purple-200 transition-colors"
                        aria-label="Cerrar"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                            Feedback de la Comunidad
                        </h1>
                        <p className="text-purple-200/60 text-sm">
                            {commentCount} {commentCount === 1 ? 'comentario' : 'comentarios'}
                        </p>
                    </div>
                </div>

                {/* Refresh button */}
                <button
                    onClick={loadComments}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    <svg
                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Actualizar</span>
                </button>
            </div>

            {/* Chat Container */}
            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
                style={{
                    scrollBehavior: 'smooth'
                }}
            >
                {loading && comments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                            <p className="text-purple-200/60">Cargando comentarios...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-300 mb-4">{error}</p>
                            <button
                                onClick={loadComments}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            >
                                Intentar de nuevo
                            </button>
                        </div>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <svg className="w-16 h-16 text-purple-400/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-purple-200/60 text-lg mb-2">No hay comentarios aún</p>
                            <p className="text-purple-200/40 text-sm">¡Sé el primero en compartir tu feedback!</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="group hover:bg-white/5 rounded-lg p-3 transition-colors"
                            >
                                <div className="flex items-start space-x-3">
                                    {/* Avatar - Clickable */}
                                    <button
                                        onClick={() => handleAvatarClick(comment)}
                                        className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarColor(comment.userName)} flex items-center justify-center text-white font-bold text-sm hover:ring-2 hover:ring-purple-400 transition-all cursor-pointer transform hover:scale-110`}
                                        title="Ver información del usuario"
                                    >
                                        {getInitials(comment.userName)}
                                    </button>

                                    {/* Message */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline space-x-2 mb-1">
                                            <button
                                                onClick={() => handleAvatarClick(comment)}
                                                className="font-semibold text-purple-200 hover:text-purple-100 transition-colors cursor-pointer"
                                            >
                                                {comment.userName || 'Anónimo'}
                                            </button>
                                            <span className="text-purple-200/40 text-xs">
                                                {formatTime(comment.createdAt)}
                                            </span>
                                            {comment.userId === currentUser?.id && (
                                                <span className="text-xs px-2 py-0.5 bg-purple-600/30 text-purple-200 rounded">
                                                    Tú
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-purple-100 text-sm leading-relaxed break-words">
                                            {comment.comment}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Chat Input Footer */}
            <div className="bg-[#1a1a24] border-t border-purple-600/30 px-4 py-4">
                {/* Error message */}
                {sendError && (
                    <div className="mb-3 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        {sendError}
                    </div>
                )}

                {/* Chat input form */}
                <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                    {/* User avatar */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getAvatarColor(fullName || currentUser?.name || currentUser?.email || 'Anónimo')} flex items-center justify-center text-white font-bold text-sm`}>
                        {getInitials(fullName || currentUser?.name || currentUser?.email || 'Anónimo')}
                    </div>

                    {/* Nombre completo (obligatorio) y correo (no editable) */}
                    <div className="w-56 mr-3">
                        <label htmlFor="senderName" className="block text-xs text-purple-200/60 mb-1">Nombre completo</label>
                        <input
                            id="senderName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder="Tu nombre completo"
                            className="w-full px-3 py-2 bg-[#0e0e1a] text-purple-100 placeholder-purple-200/40 rounded-lg border border-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-all"
                        />

                        <label htmlFor="senderEmail" className="block text-xs text-purple-200/60 mb-1 mt-3">Correo electrónico</label>
                        <input
                            id="senderEmail"
                            type="email"
                            value={currentUser?.email || ''}
                            readOnly
                            className="w-full px-3 py-2 bg-[#0e0e1a] text-purple-200 placeholder-purple-400 rounded-lg border border-purple-600/20 focus:outline-none opacity-70 cursor-not-allowed"
                        />
                    </div>
                    {/* Message input */}
                    <div className="flex-1">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu feedback aquí... (Enter para enviar, Shift+Enter para nueva línea)"
                            disabled={isSending}
                            rows="2"
                            className="w-full px-4 py-3 bg-[#0e0e1a] text-purple-100 placeholder-purple-200/40 rounded-lg border border-purple-600/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            style={{ maxHeight: '120px' }}
                        />
                        <div className="flex items-center justify-between mt-2 px-1">
                            <span className="text-xs text-purple-200/40">
                                {newMessage.length}/1000
                            </span>
                            <span className="text-xs text-purple-200/40">
                                💡 Enter para enviar • Shift+Enter para nueva línea
                            </span>
                        </div>
                    </div>

                    {/* Send button */}
                    <button
                        type="submit"
                        disabled={isSending || !newMessage.trim()}
                        className="flex-shrink-0 p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                        title="Enviar mensaje"
                    >
                        {isSending ? (
                            <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>

            {/* User Info Modal */}
            {showUserModal && selectedUser && (
                <div 
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={closeUserModal}
                >
                    <div 
                        className="bg-[#1a1a24] rounded-xl shadow-2xl max-w-md w-full border border-purple-600/30 transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-4 border-b border-purple-600/30 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-purple-200">
                                Información del Usuario
                            </h3>
                            <button
                                onClick={closeUserModal}
                                className="text-purple-300 hover:text-purple-100 transition-colors"
                                aria-label="Cerrar"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-6">
                                <div className={`w-24 h-24 rounded-full ${getAvatarColor(selectedUser.name)} flex items-center justify-center text-white font-bold text-3xl shadow-lg mb-4`}>
                                    {getInitials(selectedUser.name)}
                                </div>
                                {selectedUser.isCurrentUser && (
                                    <span className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-full text-sm font-medium">
                                        Este eres tú
                                    </span>
                                )}
                            </div>

                            {/* User Details */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="bg-[#0e0e1a] rounded-lg p-4 border border-purple-600/20">
                                    <label className="text-purple-200/60 text-xs font-medium uppercase tracking-wide mb-1 block">
                                        Nombre Completo
                                    </label>
                                    <p className="text-purple-100 text-lg font-medium">
                                        {selectedUser.name}
                                    </p>
                                </div>

                                {/* Email */}
                                <div className="bg-[#0e0e1a] rounded-lg p-4 border border-purple-600/20">
                                    <label className="text-purple-200/60 text-xs font-medium uppercase tracking-wide mb-1 block">
                                        Correo Electrónico
                                    </label>
                                    <p className="text-purple-100 text-lg break-all">
                                        {selectedUser.email}
                                    </p>
                                </div>

                                {/* User ID (optional, for reference) */}
                                {selectedUser.userId && (
                                    <div className="bg-[#0e0e1a] rounded-lg p-4 border border-purple-600/20">
                                        <label className="text-purple-200/60 text-xs font-medium uppercase tracking-wide mb-1 block">
                                            ID de Usuario
                                        </label>
                                        <p className="text-purple-100/60 text-sm font-mono">
                                            {selectedUser.userId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 bg-[#0e0e1a]/50 border-t border-purple-600/20 flex justify-end">
                            <button
                                onClick={closeUserModal}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackPage;
