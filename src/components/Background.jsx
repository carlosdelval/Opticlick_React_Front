// Background.jsx
import React from "react";

const Background = () => {
  return (
    <div className="fixed inset-0 w-full h-screen bg-white -z-10">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
    </div>
  );
};

export default Background;
