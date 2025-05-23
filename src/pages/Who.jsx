//Página de quiénes somos
import React from "react";
import BlurText from "../components/BlurText";
import FadeContent from "../components/Fade";
import FlowingMenu from "../components/FlowingMenu";

const Who = () => {
  const [titleLoaded, setTitleLoaded] = React.useState(false);
  const [leftLoaded, setLeftLoaded] = React.useState(false);

  const menuItems = [
    {
      link: "#",
      text: "Gmail",
      image: "gmail.png",
    },
    {
      link: "#",
      text: "Instagram",
      image: "instagram.png",
    },
    {
      link: "#",
      text: "Facebook",
      image: "facebook.jpg",
    },
    {
      link: "#",
      text: "X",
      image: "x.png",
    },
  ];

  const handleAnimationComplete = () => {
    setTitleLoaded(true);
    setTimeout(() => {
      setLeftLoaded(true);
    }, 600);
  };
  return (
    <div className="my-auto md:max-w-7xl md:mx-auto">
      <div className="flex justify-center md:flex-grow">
        <BlurText
          text="¿Qué es OptiClick?"
          className="text-3xl font-extrabold text-center md:text-8xl text-chryslerblue dark:text-vistablue"
          delay={300}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
        />
      </div>
      <div className="flex flex-col gap-16 pt-10 md:flex-row md:pt-20">
        {titleLoaded && (
          <div className="flex flex-col text-center md:w-1/2">
            <FadeContent
              blur={true}
              duration={1000}
              easing="ease-out"
              initialOpacity={0}
            >
              <p className="text-2xl font-semibold md:text-6xl text-chryslerblue dark:text-vistablue">
                La mejor app de gestión y reservas para tu negocio.
              </p>
              <p className="mt-8 text-xl text-black dark:text-babypowder">
                <span className="font-semibold">
                  OptiClick es la solución para gestionar tu negocio y tu agenda
                  todo en uno.
                </span>{" "}
                Con una interfaz intuitiva y fácil de usar, OptiClick permite a
                tu empresa{" "}
                <span className="font-semibold">
                  programar citas, enviar recordatorios automáticos y llevar un
                  control detallado de su agenda.
                </span>
              </p>
            </FadeContent>
          </div>
        )}
        {leftLoaded && (
          <div className="flex flex-col md:w-1/2">
            <FadeContent
              blur={true}
              duration={1000}
              easing="ease-out"
              initialOpacity={0}
            >
              <img
                src="vista_movil.png"
                alt="Vista móvil de OptiClick"
                className="justify-end rounded md:ml-auto"
              />
            </FadeContent>
          </div>
        )}
      </div>
      {leftLoaded && (
        <div className="mt-20">
          <FadeContent
            blur={true}
            duration={1000}
            easing="ease-out"
            initialOpacity={0}
          >
            <p className="text-3xl font-extrabold text-center md:text-8xl text-chryslerblue dark:text-vistablue">
              ¿Quieres unirte?
            </p>
            <p className="pt-20 pb-10 text-2xl font-semibold text-center md:text-6xl text-chryslerblue dark:text-vistablue">
              ¡Contacta con nosotros!
            </p>
            <div style={{ height: "600px", position: "relative" }}>
              <FlowingMenu items={menuItems} />
            </div>
          </FadeContent>
        </div>
      )}
    </div>
  );
};

export default Who;
