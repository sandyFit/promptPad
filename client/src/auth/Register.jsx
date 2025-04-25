import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoaderSpinner';

const Register = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        roles: {
            viewer: true,
            contributor: false
        }
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { register } = useAuth();

    const handleRoleChange = (role) => {
        setCredentials(prev => ({
            ...prev,
            roles: {
                ...prev.roles,
                [role]: !prev.roles[role]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (credentials.password !== credentials.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Ensure at least one role is selected
        if (!Object.values(credentials.roles).some(role => role)) {
            setError('Please select at least one role');
            return;
        }

        setIsLoading(true);

        try {
            // Convert roles object to array of active roles
            const activeRoles = Object.entries(credentials.roles)
                .filter(([_, isActive]) => isActive)
                .map(([role]) => role);

            await register({
                ...credentials,
                roles: activeRoles
            });
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <article className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Join PromptPad today
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                required
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border 
                                border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={credentials.email}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    email: e.target.value
                                })}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border 
                                border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    password: e.target.value
                                })}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border 
                                border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={credentials.confirmPassword}
                                onChange={(e) => setCredentials({
                                    ...credentials,
                                    confirmPassword: e.target.value
                                })}
                            />
                        </div>
                        <div className="p-4 space-y-4 border border-gray-300 rounded-b-md bg-white">
                            <p className="text-sm font-medium text-gray-700">Select your roles:</p>
                            <div className="space-y-2">
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={credentials.roles.viewer}
                                        onChange={() => handleRoleChange('viewer')}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Viewer (browse and save prompts)</span>
                                </label>
                                <label className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={credentials.roles.contributor}
                                        onChange={() => handleRoleChange('contributor')}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm text-gray-700">Contributor (create and share prompts)</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                            text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                            disabled:bg-purple-300"
                        >
                            {isLoading ? <LoadingSpinner /> : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </article>
    );
}

export default Register;
