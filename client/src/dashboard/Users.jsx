import React, { useState, useEffect } from 'react';
import RoleManagement from './RoleManagement';
import { useAuth } from '../context/AuthContext';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleUpdate = (userId, updatedRoles) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId
                    ? { ...user, roles: updatedRoles }
                    : user
            )
        );
    };

    if (!user?.role === 'admin') {
        return <div>Access denied</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {users.map(user => (
                        <li key={user.id} className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium">{user.email}</h3>
                                    <p className="text-sm text-gray-500">User ID: {user.id}</p>
                                </div>
                                <RoleManagement
                                    userId={user.id}
                                    currentRoles={user.roles}
                                    onUpdate={(roles) => handleRoleUpdate(user.id, roles)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Users;
