import { useEffect, useState } from "react";

const Background = () => {
  const [docHeight, setDocHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      setDocHeight(`${height}px`);
    };

    updateHeight(); // Inicial

    window.addEventListener("resize", updateHeight);
    window.addEventListener("load", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("load", updateHeight);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full -z-10 bg-vistablue dark:bg-dark-vista"
      style={{ height: docHeight }}
    >
      <div className="absolute inset-0 dark:bg-[radial-gradient(circle_1800px_at_100%_200px,#4A6A95,transparent)] bg-[radial-gradient(circle_2800px_at_100%_200px,#FDFFF7,transparent)]" />
    </div>
  );
};

export default Background;
