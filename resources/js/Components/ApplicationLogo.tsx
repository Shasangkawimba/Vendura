import React from 'react';

interface Props {
    className?: string;
    theme?: 'light' | 'dark';
}

export default function ApplicationLogo({
    className = "",
    theme = 'light'
}: Props) {
    const mainShapeColor = theme === 'light' ? '#1e293b' : '#ffffff';

    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`w-10 h-10 shrink-0 ${className}`}>
            <defs>
                <mask id="cutout">
                    <rect width="100" height="100" fill="white" />
                    <circle cx="47.5" cy="50" r="5" fill="black" />
                </mask>
            </defs>
            
            {/* Left Block */}
            <polygon points="0,0 35,0 60,100 25,100" fill={mainShapeColor} mask="url(#cutout)" />
            
            {/* Right Block */}
            <polygon points="65,0 100,0 75,100 40,100" fill="#60a5fa" />
            
            {/* Overlap Triangle */}
            <polygon points="50,60 60,100 40,100" fill="#3b82f6" />
        </svg>
    );
}
