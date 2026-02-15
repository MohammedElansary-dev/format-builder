import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface Props {
  text: string;
}

const Tooltip: React.FC<Props> = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center ml-1.5 cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      role="tooltip"
    >
      <HelpCircle className="w-3.5 h-3.5 text-gray-300 hover:text-indigo-500 transition-colors" />
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg shadow-xl z-50 text-center animate-fade-in pointer-events-none border border-gray-700">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;