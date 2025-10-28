import React, { useState } from 'react';
import { addComment } from '../utils/commentsAPI';
import '../styles/comments.css';

const CommentsModal = ({ isOpen, onClose, userName, userEmail }) => {
    const [comment, setComment] = useState('');
    // Nuevo campo obligatorio: nombre completo
    const [fullName, setFullName] = useState(userName || '');
    // Campo correo (antes "Nombre / Identificación")
    const [email, setEmail] = useState(userEmail || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs
        if (!fullName.trim()) {
            setError('Por favor, ingresa tu nombre completo');
            return;
        }

        if (!email.trim()) {
            setError('Por favor, ingresa tu correo');
            return;
        }

        // Basic email format check
        if (!/\S+@\S+\.\S+/.test(email.trim())) {
            setError('Por favor, ingresa un correo válido');
            return;
        }

        if (!comment.trim()) {
            setError('Por favor, escribe un comentario');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Send app feedback comment to backend
            const commentData = {
                userName: fullName.trim(),
                email: email.trim(),
                comment: comment.trim()
            };

            await addComment(commentData);

            // Success - clear form and close modal
            setComment('');
            setError('');
            onClose();

            // Show success message (optional)
            console.log('Comentario de feedback enviado exitosamente');
        } catch (err) {
            console.error('Error al enviar comentario:', err);
            setError(err.message || 'Error al enviar el comentario. Por favor, intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-[#1a1a24] rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 lg:p-8 z-10 modal-content border border-purple-600/30">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                        Enviar Feedback
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-purple-300/70 hover:text-purple-300 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name and Email Inputs */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-purple-200 mb-2"
                        >
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[#b8b8d1]/80 text-[#2a2a3a] placeholder-[#4a4a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition font-medium"
                            placeholder="Tu nombre completo"
                        />

                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-purple-200 mb-2 mt-4"
                        >
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            readOnly
                            required
                            className="w-full px-4 py-3 bg-[#b8b8d1]/80 text-[#2a2a3a] placeholder-[#4a4a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition font-medium opacity-70 cursor-not-allowed"
                            placeholder={email || 'tu@ejemplo.com'}
                        />
                    </div>

                    {/* Comment Textarea */}
                    <div>
                        <label
                            htmlFor="comment"
                            className="block text-sm font-medium text-purple-200 mb-2"
                        >
                            Feedback / Comentario
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows="5"
                            className="w-full px-4 py-3 bg-[#b8b8d1]/80 text-[#2a2a3a] placeholder-[#4a4a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition font-medium resize-none"
                            placeholder="Comparte tu opinión, sugerencias o reporta problemas sobre la aplicación..."
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 bg-white/5 text-gray-300 rounded-lg hover:bg-white/10 transition-all duration-200 font-semibold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentsModal;
