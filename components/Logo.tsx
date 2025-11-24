import React from 'react';

export const Logo = ({ className = "w-10 h-10" }: { className?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Tree Trunk - representing stability/roots */}
      <path 
        d="M42 95H58C58 95 60 80 60 70C60 60 65 50 75 40" 
        stroke="#92400e" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      <path 
        d="M50 70C50 70 45 55 25 45" 
        stroke="#92400e" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
      <path 
        d="M50 95V50" 
        stroke="#92400e" 
        strokeWidth="6" 
        strokeLinecap="round"
      />

      {/* Canopy - representing fresh produce */}
      <circle cx="50" cy="35" r="25" fill="#16a34a" fillOpacity="0.2" />
      <path 
        d="M50 10C30 10 15 25 15 40C15 55 30 65 50 65C70 65 85 55 85 40C85 25 70 10 50 10Z" 
        fill="#15803d" 
      />
      
      {/* Leaf Detail */}
      <path 
        d="M50 10C50 25 65 30 65 30" 
        stroke="#f0fdf4" 
        strokeWidth="2" 
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
};