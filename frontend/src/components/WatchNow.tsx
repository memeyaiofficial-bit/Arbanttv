import React from 'react';
import { MdLock } from 'react-icons/md';

interface WatchNowProps {
    onClick: () => void;
}

const WatchNow: React.FC<WatchNowProps> = ({ onClick }) => {
    return (
        <button
        onClick={(e) => {
            e.stopPropagation();
                // prevent triggering the card's onClick
            onClick();
        }}
        className="w-full mt-2 py-2 px-4 rounded-md bg-primary hover:bg-primary/90 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-primary/20"
        >
        <MdLock className="text-base" />
        Watch Now
        </button>
    );
};

export default WatchNow;