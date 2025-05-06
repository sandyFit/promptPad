import React, { useState } from 'react';
import { Edit, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromptCard = ({ prompt, canEditPrompt, canDeletePrompt }) => {
    const [isFavorite, setIsFavorite] = useState(prompt?.isFavorite || false);

    if (!prompt) {
        return null; // Or a placeholder card
    }

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: make an API call to update the favorite status in the backend
    };

    return (
        <article key={prompt.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 
            hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-gray-800">{prompt.title}</h3>

                <div className="flex gap-2">
                    <button
                        onClick={toggleFavorite}
                        className={`${isFavorite ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'}`}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    {canEditPrompt && (
                        <button
                            className="text-gray-500 hover:text-purple-500"
                            aria-label="Edit prompt"
                        >
                            <Edit size={16} />
                        </button>
                    )}

                    {canDeletePrompt && (
                        <button
                            className="text-gray-500 hover:text-red-600"
                            aria-label="Delete prompt"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {prompt.summary}
            </p>

            <div className="flex justify-end">
                <Link to={`/dashboard/prompts/${prompt.id}`}
                    className="flex text-sm text-purple-600 hover:text-purple-400 gap-2 mb-4 ">
                        Read Prompt
                </Link>
            </div>
          
        </article>
    );
};

export default PromptCard;
