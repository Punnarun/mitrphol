import React from "react";
import '../app/globals.css';  // Import your global CSS here

const CenteredGif = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img
        src="/truck.gif"  // Replace with your actual GIF path
        alt="Loading GIF"
        className="w-32 h-32 mb-4"    // Adjust size as needed, and add margin
      />
      <div className="text-lg font-semibold text-gray-700">Under Development</div>
    </div>
  );
};

export default CenteredGif;
