import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const PromptCard = ({ prompt, canEditPrompt, canDeletePrompt }) => {
    return (
        <div key={prompt.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-medium text-gray-800">{prompt.title}</h3>

                {(canEditPrompt || canDeletePrompt) && (
                    <div className="flex gap-2">
                        {canEditPrompt && (
                            <button className="text-gray-500 hover:text-purple-500">
                                <Edit size={16} />
                            </button>
                        )}
                        {canDeletePrompt && (
                            <button className="text-gray-500 hover:text-red-600">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {prompt.content}
            </p>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {prompt.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-xs px-2 py-1 rounded text-gray-600">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="text-xs text-gray-500">
                    By {prompt.createdBy.split('@')[0]}
                </div>
            </div>
        </div>
    )
}

export default PromptCard;
