import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="relative w-96">
            <input
                type="text"
                placeholder="Search prompts..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none 
                    focus:ring-2 focus:ring-purple-500"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
    )
}

export default SearchBar
