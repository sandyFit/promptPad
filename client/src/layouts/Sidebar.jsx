import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, User, LogOut, Settings, Users, Tag, Star } from 'lucide-react';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole] = useState('contributor'); // This should come from auth context

    // Get active view from current path
    const activeView = location.pathname.split('/')[1] || 'prompts';

    // Role-based navigation items
    const navigationItems = {
        viewer: [
            { path: '/', icon: Search, label: 'Prompts' },
            { path: '/favorites', icon: Star, label: 'Favorites' },
            { path: '/profile', icon: User, label: 'Profile' },
            { path: '/settings', icon: Settings, label: 'Settings' }
        ],
        contributor: [
            { path: '/', icon: Search, label: 'Prompts' },
            { path: '/favorites', icon: Star, label: 'Favorites' },
            { path: '/profile', icon: User, label: 'Profile' },
            { path: '/settings', icon: Settings, label: 'Settings' }
        ],
        moderator: [
            { path: '/', icon: Search, label: 'Prompts' },
            { path: '/favorites', icon: Star, label: 'Favorites' },
            { path: '/tags', icon: Tag, label: 'Manage Tags' },
            { path: '/profile', icon: User, label: 'Profile' },
            { path: '/settings', icon: Settings, label: 'Settings' }
        ],
        admin: [
            { path: '/', icon: Search, label: 'Prompts' },
            { path: '/users', icon: Users, label: 'Users' },
            { path: '/tags', icon: Tag, label: 'Manage Tags' },
            { path: '/profile', icon: User, label: 'Profile' },
            { path: '/settings', icon: Settings, label: 'Settings' }
        ]
    };

    const currentNavItems = navigationItems[userRole] || navigationItems.viewer;

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 
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
                    {currentNavItems.map((item) => (
                        <li
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`flex items-center py-3 px-4 cursor-pointer 
                            ${activeView === item.path.slice(1) ? 'bg-purple-100' : 'hover:bg-purple-50'}`}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span className="ml-3">{item.label}</span>}
                        </li>
                    ))}
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
