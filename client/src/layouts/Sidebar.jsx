import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { Menu, Search, User, LogOut, Settings, Users, Tag, Star, PenTool } from 'lucide-react';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { userRole } = useRole();

    // Get active view from current path
    const activeView = location.pathname.split('/')[1] || 'prompts';

    const isActiveRoute = (path) => {
        if (path === '/') return activeView === 'prompts';
        return activeView === path.slice(1);
    };

    // Role-based navigation items with descriptions
    const navigationItems = {
        viewer: [
            { path: '/', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/favorites', icon: Star, label: 'Favorites', description: 'Your saved prompts' },
            { path: '/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ],
        contributor: [
            { path: '/', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/create', icon: PenTool, label: 'Create Prompt', description: 'Write new prompts' },
            { path: '/favorites', icon: Star, label: 'Favorites', description: 'Your saved prompts' },
            { path: '/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ],
        moderator: [
            { path: '/', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/create', icon: PenTool, label: 'Create Prompt', description: 'Write new prompts' },
            { path: '/favorites', icon: Star, label: 'Favorites', description: 'Your saved prompts' },
            { path: '/tags', icon: Tag, label: 'Manage Tags', description: 'Organize prompt categories' },
            { path: '/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ],
        admin: [
            { path: '/', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/create', icon: PenTool, label: 'Create Prompt', description: 'Write new prompts' },
            { path: '/users', icon: Users, label: 'Users', description: 'Manage user accounts' },
            { path: '/tags', icon: Tag, label: 'Manage Tags', description: 'Organize prompt categories' },
            { path: '/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ]
    };

    const currentNavItems = navigationItems[userRole] || navigationItems.viewer;

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 
            text-gray-800 transition-all duration-300 flex flex-col`}>
            <div className="p-4 flex items-center justify-between">
                {sidebarOpen && <h1 className="text-xl font-bold">PromptPad</h1>}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-purple-50 rounded-md"
                >
                    <Menu size={20} />
                </button>
            </div>

            <nav className="flex-1 mt-8">
                <ul className="space-y-2">
                    {currentNavItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center py-3 px-4 cursor-pointer 
                                    ${isActiveRoute(item.path) ? 'bg-purple-100 text-purple-700' :
                                        'hover:bg-purple-50'}`}
                            >
                                <div className="flex items-center">
                                    <item.icon size={20} />
                                    {sidebarOpen && (
                                        <div className="ml-3">
                                            <span className="block text-sm font-medium">{item.label}</span>
                                            <span className="block text-xs text-gray-500">{item.description}</span>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <Link
                    to="/login"
                    className="flex items-center py-2 px-4 w-full hover:bg-purple-50 rounded-md"
                >
                    <LogOut size={20} />
                    {sidebarOpen && <span className="ml-3">Logout</span>}
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
