import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../layouts/Sidebar';
import Navbar from '../layouts/Navbar';
import Prompts from './Prompts';
import Users from './Users';
import Profile from './Profile';
import Settings from './Settings';
import Favorites from './Favorites';
import Tags from './Tags';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const getActiveView = () => {
        const path = location.pathname.split('/')[1];
        return path || 'prompts';
    };

    const activeView = getActiveView();

    // Component mapping based on roles
    const componentMap = {
        prompts: Prompts,
        users: Users,
        profile: Profile,
        settings: Settings,
        favorites: Favorites,
        tags: Tags
    };

    // Role-based access control
    const canAccess = (view) => {
        const accessRules = {
            prompts: ['viewer', 'contributor', 'moderator', 'admin'],
            users: ['admin'],
            profile: ['viewer', 'contributor', 'moderator', 'admin'],
            settings: ['viewer', 'contributor', 'moderator', 'admin'],
            favorites: ['viewer', 'contributor', 'moderator', 'admin'],
            tags: ['moderator', 'admin']
        };

        return accessRules[view]?.includes(user.role);
    };

    const ActiveComponent = componentMap[activeView];

    if (!ActiveComponent || !canAccess(activeView)) {
        navigate('/');
        return null;
    }

    return (
        <section className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-hidden flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6">
                    <ActiveComponent />
                </main>
            </div>
        </section>
    );
}

export default DashboardLayout;
