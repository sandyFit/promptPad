import React from 'react';
import PromptCard from '../components/cards/PromptCard';
import SearchBar from '../components/ui/SearchBar';

const Favorites = () => {
    // This would typically come from your state management or API
    const favoritePrompts = [];

    return (
        <section>
            <div className="flex justify-between mb-6">
                <SearchBar />
            </div>

            {favoritePrompts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No favorite prompts yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Save prompts you like by clicking the star icon
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favoritePrompts.map(prompt => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            canEditPrompt={false}
                            canDeletePrompt={false}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Favorites;
