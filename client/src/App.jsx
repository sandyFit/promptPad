import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";
import Login from "./auth/Login";
import ProtectedRoute from "./dashboard/ProtectedRoute";
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import Register from "./auth/Register";
import Users from "./dashboard/Users";
import Profile from "./dashboard/Profile";
import Prompts from "./dashboard/Prompts";
import Settings from "./dashboard/Settings";
import Favorites from "./dashboard/Favorites";
import Tags from "./dashboard/Tags";
import CreatePrompt from "./dashboard/CreatePrompt";
import Landing from "./pages/Landing";

const App = () => {
    return (
        <AuthProvider>
            <RoleProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Prompts />} />

                        {/* Dashboard sub-routes */}
                        <Route path="create" element={<CreatePrompt />} />
                        <Route path="users" element={<Users />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="tags" element={<Tags />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                    </Route>

                    {/* Login route outside dashboard layout */}
                    <Route path="/login" element={<Login />} />

                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />



                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </RoleProvider>
        </AuthProvider>
    );
};

export default App;
