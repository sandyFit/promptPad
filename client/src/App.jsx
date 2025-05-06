import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./dashboard/DashboardLayout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./dashboard/ProtectedRoute";
import { AuthProvider } from './context/AuthContext';
import { RoleProvider } from './context/RoleContext';
import { PromptProvider } from './context/PromptContext';
import Users from "./dashboard/Users";
import Profile from "./dashboard/Profile";
import Prompts from "./dashboard/Prompts";
import Settings from "./dashboard/Settings";
import Favorites from "./dashboard/Favorites";
import Tags from "./dashboard/Tags";
import CreatePrompt from "./dashboard/CreatePrompt";
import Landing from "./pages/Landing";
import { Toaster } from "react-hot-toast";
import PromptDetail from "./dashboard/PromptDetail";

const App = () => {
    return (
        <AuthProvider>
            <RoleProvider>
                <PromptProvider>
                    <Toaster containerClassName='toast-container-custom' position="top-center" reverseOrder={false} />
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        {/* auth route outside dashboard layout */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/dashboard" element={<DashboardLayout />}>
                            <Route index element={<Prompts />} />

                            {/* Dashboard sub-routes */}
                            <Route path="prompts/:id" element={<PromptDetail />} />
                            <Route path="create" element={<CreatePrompt />} />
                            <Route path="users" element={<Users />} />
                            <Route path="favorites" element={<Favorites />} />
                            <Route path="tags" element={<Tags />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>                  

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </PromptProvider>
            </RoleProvider>
        </AuthProvider>
    );
};

export default App;
