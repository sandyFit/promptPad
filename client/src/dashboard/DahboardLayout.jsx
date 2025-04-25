import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import Navbar from '../layouts/Navbar';
import Prompts from './Prompts';
import Users from './Users';
import Profile from './Profile';
import Settings from './Settings';

const DahboardLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    

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
                        <Users />
                    )}

                    {activeView === 'profile' && (
                        <Profile />
                    )}

                    {activeView === 'settings' && (
                        <Settings />
                    )}
                </main>
            </div>
        </section>
    );
}

export default DahboardLayout;
