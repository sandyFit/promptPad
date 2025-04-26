import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { Menu, Search, User, LogOut, Settings, Users, Tag, Star, PenTool } from 'lucide-react';

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { userRole } = useRole();

    // Function to determine if a route is active
    const isActiveRoute = (path) => {
        // Special case for the root dashboard path
        if (path === '/dashboard') {
            return location.pathname === '/dashboard' || location.pathname === '/';
        }

        // For other routes, do exact matching
        return location.pathname === path;
    };

    // Role-based navigation items with descriptions
    const navigationItems = {
        viewer: [
            { path: '/dashboard', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/dashboard/favorites', icon: Star, label: 'Favorites', description: 'Your saved prompts' },
            { path: '/dashboard/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/dashboard/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ],
        contributor: [
            { path: '/dashboard', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/dashboard/create', icon: PenTool, label: 'Create Prompt', description: 'Write new prompts' },
            { path: '/dashboard/favorites', icon: Star, label: 'Favorites', description: 'Your saved prompts' },
            { path: '/dashboard/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/dashboard/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ],
        moderator: [
            { path: '/dashboard', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/dashboard/create', icon: PenTool, label: 'Create Prompt', description: 'Write new prompts' },
            { path: '/dashboard/favorites', icon: Star, label: 'Favorites', description: 'Your saved prompts' },
            { path: '/dashboard/tags', icon: Tag, label: 'Manage Tags', description: 'Organize prompt categories' },
            { path: '/dashboard/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/dashboard/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ],
        admin: [
            { path: '/dashboard', icon: Search, label: 'Browse Prompts', description: 'Find and explore prompts' },
            { path: '/dashboard/create', icon: PenTool, label: 'Create Prompt', description: 'Write new prompts' },
            { path: '/dashboard/users', icon: Users, label: 'Users', description: 'Manage user accounts' },
            { path: '/dashboard/favorites', icon: Star, label: 'Favorites', description: 'Your saved prompts' },
            { path: '/dashboard/tags', icon: Tag, label: 'Manage Tags', description: 'Organize prompt categories' },
            { path: '/dashboard/profile', icon: User, label: 'Profile', description: 'Your profile settings' },
            { path: '/dashboard/settings', icon: Settings, label: 'Settings', description: 'App preferences' }
        ]
    };

    const currentNavItems = navigationItems[userRole] || navigationItems.viewer;

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 
            text-gray-800 transition-all duration-300 flex flex-col`}>
            <div className="p-4 flex items-center justify-between">
                {sidebarOpen && <h1 className="text-xl font-bold">PromptStack</h1>}
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
