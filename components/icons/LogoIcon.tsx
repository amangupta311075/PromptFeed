import React from 'react';

const LogoIcon: React.FC = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8 6C8 4.89543 8.89543 4 10 4H18C19.1046 4 20 4.89543 20 6V14C20 15.1046 19.1046 16 18 16H10C8.89543 16 8 15.1046 8 14V6Z" 
      className="fill-brand-blue/30 dark:fill-brand-blue/20" 
    />
    <path 
      d="M4 10C4 8.89543 4.89543 8 6 8H14C15.1046 8 16 8.89543 16 10V18C16 19.1046 15.1046 20 14 20H6C4.89543 20 4 19.1046 4 18V10Z" 
      className="fill-brand-blue" 
    />
  </svg>
);

export default LogoIcon;
