import { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import BtnPrimary from '../components/buttons/BtnPrimary';

const TagManagement = () => {
    const { userRole } = useRole();
    const [tags, setTags] = useState([
        { id: 1, name: 'creative', approved: true },
        { id: 2, name: 'stories', approved: true },
        { id: 3, name: 'design', approved: true },
        { id: 4, name: 'art', approved: true },
        { id: 5, name: 'marketing', approved: true },
        { id: 6, name: 'ecommerce', approved: true },
        { id: 7, name: 'coding', approved: true },
        { id: 8, name: 'development', approved: true },
        { id: 9, name: 'analytics', approved: false },
        { id: 10, name: 'productivity', approved: false }
    ]);
    const [newTag, setNewTag] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [editValue, setEditValue] = useState('');

    const canApprove = ['moderator', 'admin'].includes(userRole);
    const canEdit = ['moderator', 'admin'].includes(userRole);
    const canDelete = ['moderator', 'admin'].includes(userRole);
    const canCreate = ['contributor', 'moderator', 'admin'].includes(userRole);

    const bgColors = [
        'bg-red-100', 'bg-yellow-100', 'bg-blue-100', 'bg-green-100',
        'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-orange-100'
    ];

    const textColors = [
        'text-red-700', 'text-yellow-700', 'text-blue-700', 'text-green-700',
        'text-violet-700', 'text-pink-700', 'text-indigo-700', 'text-orange-700'
    ];

    const handleAddTag = () => {
        if (newTag.trim()) {
            const isAdmin = userRole === 'admin';
            const isModerator = userRole === 'moderator';

            setTags([
                ...tags,
                {
                    id: tags.length + 1,
                    name: newTag.trim().toLowerCase(),
                    approved: isAdmin || isModerator // Auto-approved for admin and moderator
                }
            ]);
            setNewTag('');
        }
    };

    const handleEditTag = (tag) => {
        setEditingTag(tag.id);
        setEditValue(tag.name);
    };

    const saveEdit = (id) => {
        setTags(tags.map(tag =>
            tag.id === id ? { ...tag, name: editValue.trim().toLowerCase() } : tag
        ));
        setEditingTag(null);
    };

    const deleteTag = (id) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    const toggleApproval = (id) => {
        setTags(tags.map(tag =>
            tag.id === id ? { ...tag, approved: !tag.approved } : tag
        ));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tag Management</h1>

            {canCreate && (
                <div className="mb-8 flex gap-2">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="New tag name"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <BtnPrimary
                        iconLeft={<Plus size={16} />}
                        btnLegend="Add Tag"
                        onClick={handleAddTag}
                    />
                </div>
            )}

            <div className="space-y-6">
                {/* Approved Tags */}
                <div>
                    <h2 className="text-lg font-semibold mb-3">Active Tags</h2>
                    <div className="flex flex-wrap gap-3">
                        {tags.filter(tag => tag.approved).map((tag, index) => (
                            <div
                                key={tag.id}
                                className={`px-3 py-2 rounded-full flex items-center ${bgColors[index % bgColors.length]} ${textColors[index % textColors.length]}`}
                            >
                                {editingTag === tag.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="bg-transparent border-b border-current px-1 focus:outline-none"
                                        />
                                        <button onClick={() => saveEdit(tag.id)} className="ml-2">
                                            <Check size={16} />
                                        </button>
                                        <button onClick={() => setEditingTag(null)} className="ml-1">
                                            <X size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span>{tag.name}</span>
                                        {canEdit && (
                                            <button onClick={() => handleEditTag(tag)} className="ml-2">
                                                <Edit2 size={16} />
                                            </button>
                                        )}
                                        {canDelete && (
                                            <button onClick={() => deleteTag(tag.id)} className="ml-1">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Tags - Only visible to moderators and admins */}
                {canApprove && tags.some(tag => !tag.approved) && (
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Pending Approval</h2>
                        <div className="flex flex-wrap gap-3">
                            {tags.filter(tag => !tag.approved).map((tag) => (
                                <div
                                    key={tag.id}
                                    className="px-3 py-2 rounded-full flex items-center bg-gray-100 text-gray-700"
                                >
                                    {editingTag === tag.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="bg-transparent border-b border-current px-1 focus:outline-none"
                                            />
                                            <button onClick={() => saveEdit(tag.id)} className="ml-2">
                                                <Check size={16} />
                                            </button>
                                            <button onClick={() => setEditingTag(null)} className="ml-1">
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{tag.name}</span>
                                            <button onClick={() => toggleApproval(tag.id)} className="ml-2 text-green-600">
                                                <Check size={16} />
                                            </button>
                                            {canEdit && (
                                                <button onClick={() => handleEditTag(tag)} className="ml-1">
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                            {canDelete && (
                                                <button onClick={() => deleteTag(tag.id)} className="ml-1">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagManagement;
