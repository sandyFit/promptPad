import { useLocation } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

const Navbar = () => {
    const location = useLocation();
    const { userRole, setUserRole } = useRole();

    // Get active view from URL - optimized for Outlet structure
    const getActiveView = () => {
        const path = location.pathname;

        // Handle root dashboard path
        if (path === '/' || path === '/dashboard') {
            return 'prompts';
        }

        // For dashboard sub-routes, extract the last segment
        if (path.startsWith('/dashboard/')) {
            return path.split('/').pop();
        }

        // Default fallback
        return 'prompts';
    };

    const getViewTitle = (view) => {
        const titles = {
            prompts: 'Prompt Collection',
            users: 'User Management',
            profile: 'Your Profile',
            settings: 'Settings',
            favorites: 'Favorite Prompts',
            tags: 'Manage Tags',
            create: 'Create New Prompt'
        };
        return titles[view] || 'Prompt Collection';
    };

    // Role badge colors
    const roleBadgeColors = {
        viewer: 'bg-gray-100 text-gray-700',
        contributor: 'bg-purple-100 text-purple-700',
        moderator: 'bg-blue-100 text-blue-700',
        admin: 'bg-red-100 text-red-700'
    };

    const handleRoleChange = (e) => {
        setUserRole(e.target.value);
    };

    return (
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
            <div className="flex items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {getViewTitle(getActiveView())}
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm ${roleBadgeColors[userRole]}`}>
                    Role: {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </div>

                <select
                    value={userRole}
                    onChange={handleRoleChange}
                    className="border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm 
                             hover:border-purple-500 focus:outline-none focus:ring-2 
                             focus:ring-purple-500 focus:border-transparent"
                >
                    <option value="viewer">Viewer</option>
                    <option value="contributor">Contributor</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        </header>
    );
};

export default Navbar;
