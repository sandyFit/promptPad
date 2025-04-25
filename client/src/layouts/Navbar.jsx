import { useState } from 'react';

const Navbar = () => {
    const [activeView, setActiveView] = useState('prompts');
    const [userRole, setUserRole] = useState('contributor');

    return (
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
            <div className="flex items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {activeView === 'prompts' && 'Prompt Library'}
                    {activeView === 'users' && 'User Management'}
                    {activeView === 'profile' && 'Your Profile'}
                    {activeView === 'settings' && 'Settings'}
                </h2>
            </div>

            <div className="flex items-center space-x-2">
                <div className="bg-purple-100 px-3 py-1 rounded-full text-sm text-purple-700">
                    Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </div>

                {/* Role switcher (for demo purposes) */}
                <select
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm"
                >
                    <option value="viewer">Viewer</option>
                    <option value="contributor">Contributor</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </header>
    )
}

export default Navbar;
