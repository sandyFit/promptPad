import React from 'react';
import { Plus } from 'lucide-react';

const BtnPrimary = ({ btnLegend }) => {
    return (
        <button className="flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-md 
            hover:bg-purple-200">
            <Plus size={18} className="mr-2" />
            {btnLegend}
        </button>
    )
}

export default BtnPrimary;
