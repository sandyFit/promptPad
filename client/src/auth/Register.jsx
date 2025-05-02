import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoaderSpinner';
import { validateForm, handleFieldBlur } from '../utils/validateForm';
import { toast } from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react';
import Footer from '../layouts/Footer';
import LandingNavbar from '../layouts/LandingNavbar';
import debounce from 'lodash/debounce';


const Register = () => {
    // Form state management
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Navigation and auth context hooks
    const navigate = useNavigate();
    const { registerUser, loading, error, user } = useAuth();

    // Form validation states
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    // Password visibility 
    const [showPasswords, setShowPasswords] = useState({
        password: false,
        confirmPassword: false
    });

    // Inside component
    const debouncedValidation = useCallback(
        debounce((credentials) => {
            const errors = validateForm(credentials);
            setFormErrors(errors);
            setIsFormValid(Object.keys(errors).length === 0);
        }, 300),
        []
    );

    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            debouncedValidation(credentials);
        }
    }, [credentials, touched, debouncedValidation]);

    // Check if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    // Validate form whenever credentials change
    useEffect(() => {
        if (Object.keys(touched).length > 0) {
            const errors = validateForm(credentials);
            setFormErrors(errors);
            setIsFormValid(Object.keys(errors).length === 0);
        }
    }, [credentials, touched]);

    // Handle Inputs changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
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

        // Touch all fields to show validation errors
        const allTouched = Object.keys(credentials).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // Validate form
        const errors = validateForm(credentials);
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.error('Please fix the form errors before submitting');
            return;
        }

        try {
            const userData = {
                username: credentials.username.trim(),
                email: credentials.email.trim().toLowerCase(),
                password: credentials.password
            };

            // Log sanitized request data
            console.log('Sending registration request:', {
                ...userData,
                password: '[REDACTED]'
            });

            const response = await registerUser(userData);

            if (response?.success) {
                toast.success('Registration successful! Please log in.');
                setCredentials({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });
                setTouched({});
                navigate('/login', { replace: true });
            } else {
                throw new Error(response?.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err.message);
            toast.error(err.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <section className="w-full min-h-screen bg-purple-100 px-4 md:px-24 pt-4 flex flex-col justify-between">
            <LandingNavbar />
            <div className='w-full flex flex-col justify-center items-center py-8'>
                <article className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Create an account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter your details to create a new account
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="sr-only">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    autoComplete='username'
                                    aria-required="true"
                                    className={`appearance-none rounded relative block w-full px-3 py-2 border 
                                    ${touched.username && formErrors.username ? 'border-red-300' : 'border-gray-300'} 
                                    placeholder-gray-500 text-gray-900 focus:outline-none 
                                    focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                                    placeholder="Username"
                                    value={credentials.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.username && formErrors.username && (
                                    <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete='email'
                                    className={`appearance-none rounded relative block w-full px-3 py-2 border 
                                    ${touched.email && formErrors.email ? 'border-red-300' : 'border-gray-300'} 
                                    placeholder-gray-500 text-gray-900 focus:outline-none 
                                    focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
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
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        type={showPasswords.password ? "text" : "password"}
                                        name="password"
                                        required
                                        className={`appearance-none relative block w-full px-3 py-2 border rounded
                                        ${touched.password && formErrors.password ? 'border-red-300' : 'border-gray-300'} 
                                        placeholder-gray-500 text-gray-900 focus:outline-none 
                                        focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
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
                                        aria-label={showPasswords.password ? "Hide password" : "Show password"}
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
                            <div className="space-y-1">
                                <div className="relative">
                                    <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        type={showPasswords.confirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        autoComplete='new-password'
                                        className={`appearance-none relative block w-full px-3 py-2 border rounded
                                        ${touched.confirmPassword && formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'} 
                                        placeholder-gray-500 text-gray-900 focus:outline-none 
                                        focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
                                        placeholder="Confirm Password"
                                        value={credentials.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center 
                                            text-gray-400 hover:text-gray-500"
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                        tabIndex="-1"
                                        aria-label={showPasswords.confirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPasswords.confirmPassword ?
                                            <EyeOff className="h-5 w-5" /> :
                                            <Eye className="h-5 w-5" />
                                        }
                                    </button>
                                </div>
                                {touched.confirmPassword && formErrors.confirmPassword && (
                                    <p className="text-red-500 text-xs">{formErrors.confirmPassword}</p>
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
                                {loading ? <LoadingSpinner /> : 'Create Account'}
                            </button>
                        </div>
                        <p className='text-sm text-gray-600 text-center'>
                            Already have an account?
                            <Link to="/login"
                                className="font-medium text-purple-600 hover:text-purple-400 ml-2 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                                    underline underline-offset-4">
                                Login
                            </Link>
                        </p>
                    </form>
                </article>
            </div>
            <Footer />
        </section>
    );
}

export default Register;
