import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import BtnPrimary from '../components/buttons/BtnPrimary';
import { ArrowRight } from 'lucide-react';

const LandingNavbar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isLoginPage = location.pathname === '/login';

    return (
        <header className='flex justify-between items-center'>

            <Link to="/" className="text-xl font-bold">
                PromptStack
            </Link>
            <div className="border-2 border-purple-600 text-purple-600 rounded">
                <BtnPrimary
                    onClick={() => navigate(`/${isLoginPage ? 'register' : 'login'}`)}
                    btnLegend={isLoginPage ? 'Sign Up' : 'Sign In'}
                    iconRight={<ArrowRight size={16} />}
                />
            </div>
        </header>
    )
}

export default LandingNavbar;
