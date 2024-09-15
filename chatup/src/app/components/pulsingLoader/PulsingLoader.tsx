import React from "react";

const PulsingLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center rounded-md h-full w-full">
      <div className="flex space-x-3">
        <div className="w-4 h-4 bg-gold-500 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-gold-600 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-gold-700 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default PulsingLoader;