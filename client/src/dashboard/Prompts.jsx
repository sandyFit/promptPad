import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptCard from '../components/cards/PromptCard';

import { usePrompt } from '../context/PromptContext';
import PromptHeader from '../components/ui/PromptHeader';

const Prompts = () => {
    const { allPrompts: prompts, getAllPrompts, loading, error } = usePrompt();
    const navigate = useNavigate();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const fetchPrompts = async () => {
            if (isInitialized) return;

            try {
                await getAllPrompts();
                setIsInitialized(true);
            } catch (err) {
                console.error('Failed to fetch prompts:', err);
                // Don't set isInitialized on error to allow retrying
            }
        };

        fetchPrompts();
    }, [getAllPrompts, isInitialized]);

    // Retry handler
    const handleRetry = async () => {
        try {
            await getAllPrompts();
            setIsInitialized(true);
        } catch (err) {
            console.error('Retry failed:', err);
        }
    };

    if (loading && !isInitialized) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
            </div>
        );
    }

    if (error) {
        return (
            <section>
                <PromptHeader />
                <hr className='border border-gray-200 mb-6' />
                <div className="text-center py-8">
                    <p className="text-red-500">
                        {error === 'Invalid response format'
                            ? 'Unable to load prompts. Please try again.'
                            : `Error loading prompts: ${error}`}
                    </p>
                    <button
                        onClick={handleRetry}
                        className="mt-4 px-4 py-2 text-white bg-purple-600 
                                 hover:bg-purple-700 rounded-md transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <div>
            {/* Search and actions bar */}
            <PromptHeader />

            <hr className='border border-gray-200 mb-6' />
            {/* Prompts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts && prompts.length > 0 ? (
                    prompts.map(prompt => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            canEditPrompt={true} // TODO: Add proper permission check
                            canDeletePrompt={true} // TODO: Add proper permission check
                        />
                    ))
                ) : (
                    <div className="col-span-3 py-8 text-center text-gray-500">
                        <p>No prompts available.</p>
                        <button
                            onClick={() => navigate('/dashboard/create-prompt')}
                            className="mt-4 text-purple-600 hover:text-purple-800"
                        >
                            Create your first prompt
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prompts;
