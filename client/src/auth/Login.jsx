import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateForm, handleFieldBlur } from '../utils/validateForm';
import LoadingSpinner from '../components/ui/LoaderSpinner';
import Footer from '../layouts/Footer';
import LandingNavbar from '../layouts/LandingNavbar';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    // Form validation states
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Password visibility 
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false
    })


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleBlur = (e) => { 
        handleFieldBlur(e, credentials, setTouched, setFormErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate inputs before submission
        if (validateForm(credentials)) return;

        try {
            const response = await login(credentials);

            if (!response?.success) {
                throw new Error(response?.message || 'Login failed');
            }

            // Check local storage after successful login
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                throw new Error('Authentication failed: User data not found');
            }

            // Clear sensitive data immediately after successful login
            setCredentials({ email: '', password: '' });

            // Show success message before navigation
            toast.success('Logged in successfully!');

            // Navigate to dashboard
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);

            // Implement specific error messages based on error type
            const errorMessage = err.message.includes('User data not found')
                ? 'Authentication failed. Please try logging in again.'
                : 'Invalid email or password';

            toast.error(errorMessage);
        } finally {
            // Clear sensitive data in case of error
            setCredentials(prev => ({ ...prev, password: '' }));
        }
    };

    return (
        <section className="w-full h-screen bg-purple-100 px-24 pt-4 flex flex-col justify-between">
            <LandingNavbar />
            <div className='w-full flex flex-col justify-center items-center'>

                <article className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Log in
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete='email'
                                    className="appearance-none rounded relative block w-full px-3 py-2 border 
                                    border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                    focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.email && formErrors.email && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className="relative">
                                    <input
                                        type={showPasswords.password ? "text" : "password"}
                                        name="password"
                                        required
                                        className="appearance-none relative block w-full px-3 py-2 border rounded
                                        border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                        focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        autoComplete='new-password'
                                        value={credentials.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                        onClick={() => togglePasswordVisibility('password')}
                                        tabIndex="-1"
                                    >
                                        {showPasswords.password ?
                                            <EyeOff className="h-5 w-5" /> :
                                            <Eye className="h-5 w-5" />
                                        }
                                    </button>
                                </div>
                                {touched.password && formErrors.password && (
                                    <p className="text-red-500 text-xs">{formErrors.password}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                                text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 
                                disabled:bg-purple-300"
                            >
                                {loading ? <LoadingSpinner /> : 'Login'}
                            </button>
                        </div>
                        <p className='text-sm text-gray-600 text-center'>
                            Don't have an account?
                            <Link to="/register"
                                className="font-medium text-purple-600 hover:text-purple-400 ml-2 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                                    underline underline-offset-4">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </article>
            </div>
            <Footer />
        </section>
    );
};

export default Login;
