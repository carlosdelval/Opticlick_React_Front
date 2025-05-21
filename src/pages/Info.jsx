//Página de información legal, política de privacidad y condiciones de uso
import React from "react";
import AnimatedList from "../components/AnimatedList";

const Info = () => {
    const [titleLoaded, setTitleLoaded] = React.useState(false);
    const [leftLoaded, setLeftLoaded] = React.useState(false);
    
    const menuItems = [
        {
        link: "#",
        text: "Política de privacidad",
        },
        {
        link: "#",
        text: "Condiciones de uso",
        },
        {
        link: "#",
        text: "Información legal",
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
            <h1
            className="text-3xl font-extrabold text-center md:text-8xl text-chryslerblue dark:text-vistablue"
            onAnimationComplete={handleAnimationComplete}
            >
            Información
            </h1>
        </div>
        <div className="flex flex-col gap-16 pt-10 md:flex-row md:pt-20">
            {titleLoaded && (
            <div className="flex flex-col text-center md:w-1/2">
                <AnimatedList
                items={menuItems.map((item) => item.text)}
                onItemSelect={(item) => {
                    window.location.href = item.link;
                }}
                showGradients={true}
                />
            </div>
            )}
        </div>
        </div>
    );
    }
