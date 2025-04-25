import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import BtnPrimary from '../components/buttons/BtnPrimary';

const Tags = () => {
    // This would typically come from your state management or API
    const [tags, setTags] = useState([
        { id: 1, name: 'creative', count: 15 },
        { id: 2, name: 'marketing', count: 8 },
        { id: 3, name: 'development', count: 12 }
    ]);

    return (
        <section className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium">Manage Tags</h3>
                <BtnPrimary btnLegend="Create Tag" icon={<Plus size={16} />} />
            </div>

            <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prompts</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tags.map(tag => (
                            <tr key={tag.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{tag.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{tag.count}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="text-red-600 hover:text-red-800">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Tags;
