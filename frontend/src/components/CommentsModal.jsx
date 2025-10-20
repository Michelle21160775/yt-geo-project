import React, { useState } from 'react';
import '../styles/comments.css';

const CommentsModal = ({ isOpen, onClose, userName, userEmail }) => {
    const [comment, setComment] = useState('');
    const [name, setName] = useState(userName || userEmail || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Aquí irá la lógica de envío después
        console.log('Comentario enviado:', { name, comment });
        
        // Limpiar el formulario
        setComment('');
        
        // Cerrar el modal
        onClose();
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
                        Enviar Comentario
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

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div>
                        <label 
                            htmlFor="name" 
                            className="block text-sm font-medium text-purple-200 mb-2"
                        >
                            Nombre / Identificación
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[#b8b8d1]/80 text-[#2a2a3a] placeholder-[#4a4a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition font-medium"
                            placeholder="Tu nombre o identificación"
                        />
                    </div>

                    {/* Comment Textarea */}
                    <div>
                        <label 
                            htmlFor="comment" 
                            className="block text-sm font-medium text-purple-200 mb-2"
                        >
                            Comentario
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            rows="5"
                            className="w-full px-4 py-3 bg-[#b8b8d1]/80 text-[#2a2a3a] placeholder-[#4a4a5a] rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition font-medium resize-none"
                            placeholder="Escribe tu comentario aquí..."
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
                            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-semibold shadow-lg"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentsModal;
