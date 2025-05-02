import React from 'react';

const BtnPrimary = ({ onClick, iconLeft, btnLegend, iconRight }) => {
    return (
        <button onClick={onClick}
            className="flex items-center px-4 py-2 gap-2 uppercase tracking-wide font-medium">
            {iconLeft}
            {btnLegend}
            {iconRight}
        </button>
    )
}

export default BtnPrimary;
