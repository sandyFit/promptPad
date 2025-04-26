import React from 'react';
import { Plus } from 'lucide-react';

const BtnPrimary = ({ iconLeft, btnLegend, iconRight }) => {
    return (
        <button className="flex items-center px-4 py-2 gap-2 uppercase tracking-wide font-medium">
            {iconLeft}
            {btnLegend}
            {iconRight}
        </button>
    )
}

export default BtnPrimary;
