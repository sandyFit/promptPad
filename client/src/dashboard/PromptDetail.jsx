import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePrompt } from '../context/PromptContext';
import LoaderSpinner from '../components/ui/LoaderSpinner';
import BtnPrimary from '../components/buttons/BtnPrimary';
import { CopyIcon } from 'lucide-react';


const PromptDetail = () => {
    const { id } = useParams();
    const { prompt, getPromptById, loading, error } = usePrompt();
    const [isInitialized, setIsInitialized] = useState(false);
    const [copyPrompt, setCopyPrompt] = useState(false);

    const handleCopyPrompt = () => { 
        try {
            navigator.clipboard.writeText(prompt.content);
            setCopyPrompt(true);
            setTimeout(() => {
                setCopyPrompt(false);
            }, 2000);
        } catch (error) {
            console.error('Error copying prompt:', error);
        }
        
    }

    const fetchPrompt = async () => {
        if (isInitialized) return;
        try {
            if (id) await getPromptById(id);
        } catch (err) {
            console.error('Error loading prompt:', err);
        }
    };
    // useEffect(() => {   
    //     fetchPrompt();
    // }, [id, getPromptById, isInitialized]);

    if (loading) {
        return <LoaderSpinner isLoading={true} />;
    }

    const renderDescription = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}<br />
            </React.Fragment>
        ));
    };

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => getPromptById(id)}
                    className="text-purple-600 hover:text-purple-800"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!prompt) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Prompt not found</p>
            </div>
        );
    }

    return (
        <section className="md:max-w-4xl mx-auto pt-2 md:p-6 overflow-y-auto">
            <h2 className="md:text-center text-gray-800 text-2xl font-semibold mb-4">
                {prompt.title}
            </h2>
            <div className="prose max-w-none">
                {renderDescription(prompt.content)}
            </div>

            <div className="flex justify-end mt-6">
                <div className="flex border border-purple-600 rounded text-purple-600
                    hover:border-purple-300 hover:text-purple-500">
                    <BtnPrimary
                        iconLeft={<CopyIcon size={16} />}
                        btnLegend={copyPrompt ? 'Prompt Copied!' : 'Copy this prompt'}
                        className="mt-4"
                        onClick={handleCopyPrompt}
                        disabled={copyPrompt} // Disable button while copying

                        
                    />
                </div>
            </div>
        </section>
    );
};

export default PromptDetail;
