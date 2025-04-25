import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: null,
        email: null,
        role: 'viewer',
        isAuthenticated: false
    });

    const login = (userData) => {
        setUser({
            ...userData,
            isAuthenticated: true
        });
    };

    const logout = () => {
        setUser({
            id: null,
            email: null,
            role: 'viewer',
            isAuthenticated: false
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
