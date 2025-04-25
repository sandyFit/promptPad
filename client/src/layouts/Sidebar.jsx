import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, User, LogOut, Settings, Users } from 'lucide-react';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole] = useState('contributor');

    // Get active view from current path
    const activeView = location.pathname.split('/')[1] || 'prompts';

    // UI changes based on user role
    const canManageUsers = ['admin'].includes(userRole);

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-b border-gray-200 
            text-gray-800 transition-all duration-300 flex flex-col`}>
            <div className="p-4 flex items-center justify-between">
                {sidebarOpen ? (
                    <h1 className="text-xl font-bold">PromptPad</h1>
                ) : (
                    <h1 className="text-xl font-bold">🎨</h1>
                )}
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
                    <Menu size={20} />
                </button>
            </div>

            <nav className="flex-1 mt-8">
                <ul>
                    <li onClick={() => navigate('/')}
                        className={`flex items-center py-3 px-4 cursor-pointer 
                        ${activeView === 'prompts' ? 'bg-purple-100' : 'hover:bg-purple-50'}`}>
                        <Search size={20} />
                        {sidebarOpen && <span className="ml-3">Prompts</span>}
                    </li>
                    {canManageUsers && (
                        <li onClick={() => navigate('/users')}
                            className={`flex items-center py-3 px-4 cursor-pointer 
                            ${activeView === 'users' ? 'bg-purple-100' : 'hover:bg-purple-50'}`}>
                            <Users size={20} />
                            {sidebarOpen && <span className="ml-3">Users</span>}
                        </li>
                    )}
                    <li onClick={() => navigate('/profile')}
                        className={`flex items-center py-3 px-4 cursor-pointer 
                        ${activeView === 'profile' ? 'bg-purple-100' : 'hover:bg-purple-50'}`}>
                        <User size={20} />
                        {sidebarOpen && <span className="ml-3">Profile</span>}
                    </li>
                    <li onClick={() => navigate('/settings')}
                        className={`flex items-center py-3 px-4 cursor-pointer 
                        ${activeView === 'settings' ? 'bg-purple-100' : 'hover:bg-purple-50'}`}>
                        <Settings size={20} />
                        {sidebarOpen && <span className="ml-3">Settings</span>}
                    </li>
                </ul>
            </nav>

            <div className="p-4">
                <div className="flex items-center py-2 cursor-pointer hover:bg-purple-100 rounded px-2">
                    <LogOut size={20} />
                    {sidebarOpen && <span className="ml-3">Logout</span>}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
