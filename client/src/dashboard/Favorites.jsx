import React, { useState, useEffect } from 'react';
import PromptCard from '../components/cards/PromptCard';
import SearchBar from '../components/ui/SearchBar';
import { useRole } from '../context/RoleContext';
import mockPrompts from '../data/prompts';

const Favorites = () => {
    const { userRole } = useRole();
    const [favoritePrompts, setFavoritePrompts] = useState([]);

    const canEditPrompt = ['contributor', 'moderator', 'admin'].includes(userRole);
    const canDeletePrompt = ['moderator', 'admin'].includes(userRole);

    // TODO: fetch the user's favorite prompts from an API
    useEffect(() => {
        // Mock data - pretend these are the user's favorites
        // TODO: fetch this from the backend
        const mockFavorites = mockPrompts
            .filter((_, index) => index % 3 === 0) // Just for demo - every 3rd prompt is a favorite
            .map(prompt => ({
                ...prompt,
                isFavorite: true
            }));

        setFavoritePrompts(mockFavorites);
    }, []);

    return (
        <div>
            <div className="flex justify-between mb-6">
                <SearchBar placeholder="Search your favorites..." />

                <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md flex items-center">
                    <span className="mr-2">{favoritePrompts.length}</span>
                    <span>Favorites</span>
                </div>
            </div>

            {favoritePrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoritePrompts.map(prompt => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            canEditPrompt={canEditPrompt}
                            canDeletePrompt={canDeletePrompt}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No favorite prompts yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Browse the prompt library and click the star icon to add prompts to your favorites.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Favorites;
