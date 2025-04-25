import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import Navbar from '../layouts/Navbar';
import Prompts from './Prompts';

const DahboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, setUserRole] = useState('contributor');

    // Update activeView based on current path
    const getActiveView = () => {
        const path = location.pathname.split('/')[1];
        return path || 'prompts';
    };

    const activeView = getActiveView();

    // Update navigation handlers
    const handleViewChange = (view) => {
        navigate(`/${view}`);
    };

    
    return (
        <section className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Header */}
                <Navbar />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    {activeView === 'prompts' && (
                        <Prompts />
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
        </section>
    );
}

export default DahboardLayout;
