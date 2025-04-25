import { useState } from 'react';
import { Search, Plus, Tag } from 'lucide-react';
import Sidebar from './layouts/Sidebar';
import Navbar from './layouts/Navbar';
import PromptCard from './components/cards/PromptCard';
import BtnPrimary from './components/buttons/BtnPrimary';
import TagComponent from './components/ui/TagComponent';
import SearchBar from './components/ui/SearchBar';

// Mock data
const mockPrompts = [
    { id: 1, title: "AI Story Generator", content: "Write a short story about [topic] set in [setting] with a character who [character trait].", tags: ["creative", "stories"], createdBy: "alex@example.com" },
    { id: 2, title: "Product Description Writer", content: "Create a compelling product description for [product] that highlights [features] and appeals to [target audience].", tags: ["marketing", "ecommerce"], createdBy: "sam@example.com" },
    { id: 3, title: "Code Refactoring Assistant", content: "Refactor this [language] code to improve [aspect] while maintaining the same functionality: ```[code]```", tags: ["coding", "development"], createdBy: "taylor@example.com" }
];


const App = () => {

    const [activeView, setActiveView] = useState('prompts');
    const [userRole, setUserRole] = useState('contributor'); // Options: viewer, contributor, moderator, admin


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
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Header */}
                <Navbar />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {activeView === 'prompts' && (
                        <div>
                            {/* Search and actions bar */}
                            <div className="flex justify-between mb-6">
                                <SearchBar />

                                <div className="flex gap-3">
                                    {canCreatePrompt && (
                                        <BtnPrimary btnLegend="Create Prompt" />
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
                    )}

                    {activeView === 'users' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium mb-4">User Management</h3>
                            <p>This panel is only visible to administrators.</p>
                            <div className="border rounded-md mt-4">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">alex@example.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap">Contributor</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-purple-600 hover:text-purple-700">Edit</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">sam@example.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap">Moderator</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-purple-600 hover:text-purple-700">Edit</button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 whitespace-nowrap">taylor@example.com</td>
                                            <td className="px-6 py-4 whitespace-nowrap">Viewer</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button className="text-purple-600 hover:text-purple-700">Edit</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button className="mt-4 flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                <Plus size={18} className="mr-2" />
                                Invite User
                            </button>
                        </div>
                    )}

                    {activeView === 'profile' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium mb-4">Your Profile</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value="currentuser@example.com"
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        value={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                                        disabled
                                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Roles are assigned by administrators</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'settings' && (
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-medium mb-4">Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                                        Change Password
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notification Preferences</label>
                                    <div className="flex items-center">
                                        <input type="checkbox" id="notifications" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                                        <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">Email notifications for new prompts</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default App
