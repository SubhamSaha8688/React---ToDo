import React from 'react';

const Loader = ({ size = "medium" }) => {
  const sizeClass = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className={`${sizeClass[size]} border-4 border-violet-200 border-t-violet-800 rounded-full animate-spin`}></div>
    </div>
  );
};

export default Loader;