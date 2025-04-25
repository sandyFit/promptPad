import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./dashboard/DahboardLayout";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<DashboardLayout />} />
                <Route path="users" element={<DashboardLayout />} />
                <Route path="profile" element={<DashboardLayout />} />
                <Route path="settings" element={<DashboardLayout />} />
            </Route>
        </Routes>
    );
};

export default App;
