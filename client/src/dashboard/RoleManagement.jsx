import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoaderSpinner';

const RoleManagement = ({ userId, currentRoles, onUpdate }) => {
    const [roles, setRoles] = useState(currentRoles);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const handleRoleChange = async (role) => {
        if (!user?.role === 'admin') return;

        setIsLoading(true);
        try {
            const updatedRoles = {
                ...roles,
                [role]: !roles[role]
            };

            // API call to update user roles
            await fetch(`/api/users/${userId}/roles`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ roles: updatedRoles })
            });

            setRoles(updatedRoles);
            onUpdate(updatedRoles);
        } catch (error) {
            console.error('Failed to update roles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">User Roles</h3>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={roles.viewer}
                            onChange={() => handleRoleChange('viewer')}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            disabled={!user?.role === 'admin'}
                        />
                        <span className="text-sm text-gray-700">Viewer</span>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={roles.contributor}
                            onChange={() => handleRoleChange('contributor')}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            disabled={!user?.role === 'admin'}
                        />
                        <span className="text-sm text-gray-700">Contributor</span>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={roles.moderator}
                            onChange={() => handleRoleChange('moderator')}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            disabled={!user?.role === 'admin'}
                        />
                        <span className="text-sm text-gray-700">Moderator</span>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            checked={roles.admin}
                            onChange={() => handleRoleChange('admin')}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            disabled={!user?.role === 'admin'}
                        />
                        <span className="text-sm text-gray-700">Admin</span>
                    </label>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;
