// Background.jsx
import React from "react";

const Background = () => {
  return (
    <div className="fixed inset-0 w-full h-screen bg-vistablue dark:bg-chryslerblue -z-10">
      <div className="absolute bottom-0 left-0 right-0 top-0 dark:bg-[radial-gradient(circle_1800px_at_100%_200px,#8AAADC,transparent)] bg-[radial-gradient(circle_2800px_at_100%_200px,#FDFFF7,transparent)]"></div>
    </div>
  );
};

export default Background;
