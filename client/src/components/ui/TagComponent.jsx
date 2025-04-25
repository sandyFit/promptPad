import React from 'react';
import { Tag } from 'lucide-react';

const TagComponent = ({ tagLegend, bgColor, textColor }) => {
    return (
        <div className={`px-3 py-1 ${bgColor} ${textColor} rounded-full flex items-center`}>
            <Tag size={14} className="mr-1" />
            <span>{tagLegend}</span>
        </div>
    )
}

export default TagComponent;
