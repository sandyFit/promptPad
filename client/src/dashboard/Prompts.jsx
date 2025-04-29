import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PromptCard from '../components/cards/PromptCard';
import BtnPrimary from '../components/buttons/BtnPrimary';
import TagComponent from '../components/ui/TagComponent';
import SearchBar from '../components/ui/SearchBar';
import { Plus, X, Star } from 'lucide-react';
import mockPrompts from '../data/prompts';
import { useRole } from '../context/RoleContext';

const Prompts = () => {
    const { userRole } = useRole();
    const navigate = useNavigate();
    const [showTagModal, setShowTagModal] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    // TODO: fetch this data from the backend
    const [promptsData, setPromptsData] = useState(mockPrompts.map(prompt => ({
        ...prompt,
        isFavorite: false
    })));

    const canCreatePrompt = ['contributor', 'moderator', 'admin'].includes(userRole);
    const canEditPrompt = ['contributor', 'moderator', 'admin'].includes(userRole);
    const canDeletePrompt = ['moderator', 'admin'].includes(userRole);
    const canSuggestTag = ['contributor', 'moderator', 'admin'].includes(userRole);
    const canAddTagDirectly = ['moderator', 'admin'].includes(userRole);
    // All roles including viewers can favorite prompts
    const canFavoritePrompt = true;

    const bgColors = [
        'bg-red-100',
        'bg-yellow-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-purple-100',
        'bg-pink-100',
        'bg-indigo-100',
        'bg-orange-100'
    ];

    const textColors = [
        'text-red-700',
        'text-yellow-700',
        'text-blue-700',
        'text-green-700',
        'text-violet-700',
        'text-pink-700',
        'text-indigo-700',
        'text-orange-700'
    ];

    const [tags, setTags] = useState([
        { id: 1, name: 'creative', approved: true },
        { id: 2, name: 'stories', approved: true },
        { id: 3, name: 'design', approved: true },
        { id: 4, name: 'art', approved: true },
        { id: 5, name: 'marketing', approved: true },
        { id: 6, name: 'ecommerce', approved: true },
        { id: 7, name: 'coding', approved: true },
        { id: 8, name: 'development', approved: true }
    ]);

    const handleManageTags = () => {
        navigate('/dashboard/tags');
    };

    const handleAddTagSuggestion = () => {
        if (newTag.trim()) {
            // For moderators and admins, tags are immediately approved
            const isApproved = ['moderator', 'admin'].includes(userRole);

            const newTagObject = {
                id: tags.length + 1,
                name: newTag.trim().toLowerCase(),
                approved: isApproved
            };

            setTags([...tags, newTagObject]);
            setNewTag('');
            setShowTagModal(false);

            // Notify user of the action taken
            if (!isApproved) {
                alert('Your tag suggestion has been submitted for approval by a moderator.');
            }
        }
    };

    const handleTagSelect = (tagId) => {
        if (selectedTags.includes(tagId)) {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    const toggleFavoritesFilter = () => {
        setShowFavoritesOnly(!showFavoritesOnly);
    };

    // Filter prompts based on selected tags and favorites filter
    const filteredPrompts = promptsData.filter(prompt => {
        // Filter by favorites if the option is enabled
        if (showFavoritesOnly && !prompt.isFavorite) {
            return false;
        }

        // If no tags are selected, show all prompts
        if (selectedTags.length === 0) {
            return true;
        }

        // Filter by selected tags
        const promptTagIds = prompt.tags.map(tagName => {
            const tag = tags.find(t => t.name === tagName);
            return tag ? tag.id : null;
        }).filter(id => id !== null);

        return selectedTags.some(tagId => promptTagIds.includes(tagId));
    });

    return (
        <div>
            {/* Search and actions bar */}
            <div className="flex justify-between mb-6">
                <SearchBar />

                <div className="flex gap-3">
                    <div className="border border-purple-600 rounded text-purple-600 
                        hover:border-gray-200 hover:text-gray-800">
                        <BtnPrimary
                            onClick={toggleFavoritesFilter}
                            iconLeft={<Star size={16} />}
                            btnLegend="favorites" />
                    </div>

                    {canCreatePrompt && (
                        <div onClick={() => navigate('/dashboard/create-prompt')}
                            className="bg-purple-200 rounded text-purple-600 hover:bg-purple-100">
                            <BtnPrimary
                                iconLeft={<Plus size={16} />}
                                btnLegend="Create Prompt" />
                        </div>
                        
                    )}
                </div>
            </div>
            <hr className='border border-gray-200'/>

            {/* Tags filter */}
            <div className="my-6">
                <div className="flex items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-700 mr-2 my-2">Filter by tags:</h3>
                    {(canAddTagDirectly || canSuggestTag) && (
                        <button
                            onClick={() => setShowTagModal(true)}
                            className="text-sm text-purple-600 hover:text-purple-800"
                        >
                            {canAddTagDirectly ? 'Add Tag' : 'Suggest Tag'}
                        </button>
                    )}
                    {userRole === 'moderator' || userRole === 'admin' ? (
                        <button
                            onClick={handleManageTags}
                            className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                        >
                            Manage All Tags
                        </button>
                    ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.filter(tag => tag.approved).map((tag, index) => (
                        <button
                            key={tag.id}
                            onClick={() => handleTagSelect(tag.id)}
                            className={`transition-all ${selectedTags.includes(tag.id) ? 'ring-2 ring-offset-1 ring-purple-500' : ''}`}
                        >
                            <TagComponent
                                tagLegend={tag.name}
                                bgColor={bgColors[index % bgColors.length]}
                                textColor={textColors[index % textColors.length]}
                            />
                        </button>
                    ))}
                </div>
            </div>

            {/* Prompts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrompts.length > 0 ? (
                    filteredPrompts.map(prompt => (
                        <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            canEditPrompt={canEditPrompt}
                            canDeletePrompt={canDeletePrompt}
                        />
                    ))
                ) : (
                    <div className="col-span-3 py-8 text-center text-gray-500">
                        <p>No prompts match your current filters.</p>
                    </div>
                )}
            </div>

            {/* Tag suggestion modal */}
            {showTagModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                {canAddTagDirectly ? 'Add New Tag' : 'Suggest New Tag'}
                            </h3>
                            <button onClick={() => setShowTagModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                placeholder="Enter tag name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowTagModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTagSuggestion}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                                {canAddTagDirectly ? 'Add Tag' : 'Submit Suggestion'}
                            </button>
                        </div>

                        {!canAddTagDirectly && (
                            <p className="mt-4 text-xs text-gray-500">
                                Tag suggestions require approval from a moderator before they appear in the tag list.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prompts;
