import React, { useState } from 'react';
import PromptCard from '../components/cards/PromptCard';
import BtnPrimary from '../components/buttons/BtnPrimary';
import TagComponent from '../components/ui/TagComponent';
import SearchBar from '../components/ui/SearchBar';
import { Plus } from 'lucide-react';
import mockPrompts from '../data/prompts';

const Prompts = () => {
    const [userRole, setUserRole] = useState('contributor');

    const canCreatePrompt = ['contributor', 'moderator', 'admin'].includes(userRole);
    const canEditPrompt = ['contributor', 'moderator', 'admin'].includes(userRole);
    const canDeletePrompt = ['moderator', 'admin'].includes(userRole);

    const bgColors = [
        'bg-red-100',
        'bg-yellow-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-purple-100',
        'bg-pink-100',
    ];

    const textColors = [
        'text-red-700',
        'text-yellow-700',
        'text-blue-700',
        'text-green-700',
        'text-purple-700',
        'text-pink-700',
    ];

    const tags = [
        'creative',
        'stories',
        'marketing',
        'ecommerce',
        'coding',
        'development'
    ];


    return (
        <div>
            {/* Search and actions bar */}
            <div className="flex justify-between mb-6">
                <SearchBar />

                <div className="flex gap-3 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded">
                    {canCreatePrompt && (
                        <BtnPrimary
                            iconLeft={<Plus size={16} />}
                            btnLegend="Create Prompt" />
                    )}
                </div>
            </div>

            {/* Tags filter */}
            <div className="mb-6 flex gap-2">
                {tags.map((tag, index) => (
                    <TagComponent
                        key={index}
                        tagLegend={tag}
                        bgColor={bgColors[index % bgColors.length]}
                        textColor={textColors[index % textColors.length]} />
                ))}
                <button className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full flex items-center">
                    <Plus size={14} className="mr-1" />
                    <span>Add tag</span>
                </button>
            </div>

            {/* Prompts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPrompts.map(prompt => (
                    <PromptCard
                        key={prompt.id}
                        prompt={prompt}
                        canEditPrompt={canEditPrompt}
                        canDeletePrompt={canDeletePrompt} />
                ))}
            </div>
        </div>
    )
}

export default Prompts;
