// Background.jsx
import React from "react";

const Background = () => {
  return (
    <div className="fixed inset-0 w-full h-screen -z-10 bg-vistablue dark:bg-chryslerblue">
      <div style={{ width: "100%", height: "600px", position: "relative" }} />
      <div className="absolute bottom-0 left-0 right-0 top-0 dark:bg-[radial-gradient(circle_1800px_at_100%_200px,#8AAADC,transparent)] bg-[radial-gradient(circle_2800px_at_100%_200px,#FDFFF7,transparent)]" />
    </div>
  );
};

export default Background;
