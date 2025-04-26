import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./dashboard/DahboardLayout";
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
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<Prompts />} />
                        <Route path="users" element={<Users />} />
                        <Route path="prompts" element={<Prompts />} />
                        <Route path="create" element={<CreatePrompt />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="favorites" element={<Favorites />} />
                        <Route path="tags" element={<Tags />} />
                    </Route>
                </Routes>
            </RoleProvider>
        </AuthProvider>
    );
};

export default App;
