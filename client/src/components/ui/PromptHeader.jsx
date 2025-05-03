import React from 'react';
import BtnPrimary from '../buttons/BtnPrimary';
import SearchBar from '../ui/SearchBar';
import { Plus, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromptHeader = () => {

    const navigate = useNavigate();

    return (
        <header className="flex justify-between mb-6">
            <SearchBar />

            <div className="flex gap-3">
                <div className="border border-purple-600 rounded text-purple-600 
                        hover:border-gray-200 hover:text-gray-800">
                    <BtnPrimary
                        iconLeft={<Star size={16} />}
                        btnLegend="favorites" />
                </div>

                <div onClick={() => navigate('/dashboard/create-prompt')}
                    className="bg-purple-200 rounded text-purple-600 hover:bg-purple-100">
                    <BtnPrimary
                        iconLeft={<Plus size={16} />}
                        btnLegend="Create Prompt" />
                </div>
            </div>
            

        </header>
    )
}

export default PromptHeader;
