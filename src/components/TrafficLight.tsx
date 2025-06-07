
import React from 'react';

interface TrafficLightProps {
  isActive: boolean;
}

const TrafficLight: React.FC<TrafficLightProps> = ({ isActive }) => {
  return (
    <div className="flex items-center gap-1 p-2 bg-gray-800 rounded-lg border border-gray-600">
      <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
        isActive 
          ? 'bg-red-500 shadow-lg shadow-red-500/50 animate-pulse' 
          : 'bg-gray-600'
      }`} />
      <div className={`w-3 h-3 rounded-full transition-all duration-700 ${
        isActive 
          ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse' 
          : 'bg-gray-600'
      }`} style={{ animationDelay: '200ms' }} />
      <div className={`w-3 h-3 rounded-full transition-all duration-900 ${
        isActive 
          ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse' 
          : 'bg-gray-600'
      }`} style={{ animationDelay: '400ms' }} />
    </div>
  );
};

export default TrafficLight;
