import React from 'react';
import { useRole } from '../../context/RoleContext';
import { TagIcon } from 'lucide-react';

const TagComponent = ({ tagLegend, bgColor, textColor, onDelete, onEdit, showActions = false }) => {
    const { userRole } = useRole();

    const canEditTag = ['moderator', 'admin'].includes(userRole);
    const canDeleteTag = ['moderator', 'admin'].includes(userRole);

    return (
        <div className={`px-3 py-1 rounded-full ${bgColor} ${textColor} flex items-center`}>
            <TagIcon size={14} className="mr-1" />
            <span>{tagLegend}</span>

            {showActions && (
                <div className="flex ml-2">
                    {canEditTag && onEdit && (
                        <button
                            onClick={onEdit}
                            className="ml-1 hover:text-opacity-70"
                            aria-label="Edit tag"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                        </button>
                    )}

                    {canDeleteTag && onDelete && (
                        <button
                            onClick={onDelete}
                            className="ml-1 hover:text-opacity-70"
                            aria-label="Delete tag"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default TagComponent;
