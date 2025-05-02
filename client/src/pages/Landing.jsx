import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, PenTool, Library, BookOpen, Settings, FileStack, SquareStack, SquareStackIcon, ChartColumnStacked, LucideSquareStack } from 'lucide-react';
import BtnPrimary from '../components/buttons/BtnPrimary';
import features from '../data/features';
import LandingCard from '../components/cards/LandingCard';
import LandingNavbar from '../layouts/LandingNavbar';
import Footer from '../layouts/Footer';

const Landing = () => {
    const navigate = useNavigate();

    const getIconForFeature = (id) => {
        switch (id) {
            case 1: return <PenTool size={24} />;
            case 2: return <Library size={24} />;
            case 3: return <BookOpen size={24} />;
            case 4: return <Settings size={24} />;
            default: return null;
        }
    };

    return (
        <section className='w-full h-screen bg-purple-100 px-24 pt-4 flex flex-col justify-between'>
            <LandingNavbar />
            <div className="flex flex-col justify-center items-center -mt-10">
                <h1 className='text-5xl font-bold py-8 text-center'>
                    Collaborate, Create, and Master AI Prompts with
                    <span className='bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400 
                        inline-block text-transparent bg-clip-text leading-[70px] text-6xl'>
                        PromptStack
                    </span>
                </h1>
                <h3 className='text-xl text-center -mt-6'>
                    Transform Ideas into Powerful AI Prompts — All in One Place
                </h3>

                <div className="bg-purple-600 text-white mt-6 rounded">
                    <BtnPrimary
                        onClick={() => navigate('/register')}
                        btnLegend="Get Started with PromptStack"
                        iconRight={<ArrowRight size={16} />} />
                </div>

                <div className="flex justify-center items-center mt-16 gap-8 flex-wrap">
                    {features.map(feature => (
                        <LandingCard
                            key={feature.id}
                            icon={getIconForFeature(feature.id)}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>

            <Footer />
        </section>
    )
}

export default Landing;
