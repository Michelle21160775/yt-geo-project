import React from 'react';

const FloatingCommentButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 group"
            aria-label="Enviar feedback"
        >
            {/* Icon */}
            <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                strokeWidth="2"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
                />
            </svg>
            
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-[#1a1a24] text-purple-200 text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl border border-purple-600/30">
                Enviar feedback
            </span>
        </button>
    );
};

export default FloatingCommentButton;
