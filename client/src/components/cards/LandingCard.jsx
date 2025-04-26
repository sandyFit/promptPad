import React from 'react';

const LandingCard = ({ icon, title, description }) => {
    
    return (
        <article className="w-64 bg-white p-5 rounded-lg shadow-sm border border-gray-200 
            hover:shadow-md transition-shadow">
            <div className="flex flex-col justify-between items-start mb-3 gap-5">
                <span className='text-xl text-purple-600'>
                    {icon}
                </span>
                <h4 className='text-lg font-medium leading-2'>
                    {title}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                    {description}
                </p>
            </div>
        </article>
    )
}

export default LandingCard;
