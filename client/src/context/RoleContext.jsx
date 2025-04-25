import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

export const RoleProvider = ({ children }) => {
    const [userRole, setUserRole] = useState('contributor');

    return (
        <RoleContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};
