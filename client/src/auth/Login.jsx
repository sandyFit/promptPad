import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoaderSpinner';
import { toast } from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import BtnPrimary from '../components/buttons/BtnPrimary';
import { Link } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    
    const handleChange = (e) => { 
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(credentials);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <article className="w-full h-screen bg-purple-100 px-24 pt-4 ">
            <div className='w-full flex flex-col justify-center items-center'>
                <header className='w-full flex justify-between items-center'>
                    <Link to="/">
                        <h4 className="text-xl font-bold">
                            PromptStack
                        </h4>
                    </Link>

                    <div className="border-2 border-purple-600 text-purple-600 rounded">
                        <BtnPrimary
                            onClick={() => navigate('/register')}
                            btnLegend="Sign UP"
                            iconRight={<ArrowRight size={16} />}
                        />
                    </div>
                </header>

                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md mt-20">
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
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="appearance-none relative block w-full px-3 py-2 border rounded
                                    border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                    focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                    autoComplete='new-password'
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
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
                </div>
            </div>
        </article>
    );
};

export default Login;
