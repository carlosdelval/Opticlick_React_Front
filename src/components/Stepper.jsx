import React, { useState, Children, useRef, useLayoutEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  validatePaso4,
  finalStepContent = null, // NUEVA prop para contenido final
  stepCircleContainerClassName = "",
  stepContainerClassName = "",
  contentClassName = "",
  footerClassName = "",
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = "Volver",
  nextButtonText = "Siguiente",
  disableStepIndicators = false,
  renderStepIndicator,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onStepChange(newStep);
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    // Si el paso actual define una función canProceed, la ejecutamos
    if (Children.toArray(children)[currentStep].props.canProceed) {
      const allowed =
        Children.toArray(children)[currentStep].props.canProceed();
      if (!allowed) return;
    }
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  // En el último paso, llamamos a onFinalStepCompleted y avanzamos a la vista final
  const handleComplete = () => {
    // No intentes leer props si no hay más pasos
    if (currentStep <= totalSteps - 1) {
      const currentChild = Children.toArray(children)[currentStep];
      if (currentChild?.props?.canProceed) {
        const allowed = currentChild.props.canProceed();
        if (!allowed) return;
      }
    }

    // Validar el paso final antes de avanzar
    if (validatePaso4 && typeof validatePaso4 === "function") {
      const isValid = validatePaso4();
      if (!isValid) return;
    }

    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4 sm:aspect-[4/3] md:aspect-[2/1]"
      {...rest}
    >
      <div
        className={`bg-white dark:bg-gray-700 mx-auto w-full max-w-md rounded-4xl shadow-xl ${stepCircleContainerClassName}`}
        style={{
          borderRadius: "20px",
          border: "2px solid black",
        }}
      >
        <div
          className={`${stepContainerClassName} flex w-full items-center p-8`}
        >
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                {renderStepIndicator ? (
                  renderStepIndicator({
                    step: stepNumber,
                    currentStep,
                    onStepClick: (clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    },
                  })
                ) : (
                  <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators}
                    currentStep={currentStep}
                    onClickStep={(clicked) => {
                      setDirection(clicked > currentStep ? 1 : -1);
                      updateStep(clicked);
                    }}
                  />
                )}
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 px-8 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>
        {/* Si no se completó, mostramos los botones de navegación */}
        {!isCompleted ? (
          <div className={`px-8 pb-8 ${footerClassName}`}>
            <div
              className={`mt-10 flex ${
                currentStep !== 1 ? "justify-between" : "justify-end"
              }`}
            >
              {currentStep !== 1 && (
                <button
                  onClick={handleBack}
                  className={`duration-350 rounded px-2 py-1 transition ${
                    currentStep === 1
                      ? "pointer-events-none opacity-50 text-neutral-400 dark:text-neutral-700"
                      : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 dark:text-neutral-200"
                  }`}
                  {...backButtonProps}
                >
                  {backButtonText}
                </button>
              )}
              <button
                onClick={isLastStep ? handleComplete : handleNext}
                className="select-none duration-350 flex items-center justify-center rounded-full bg-chryslerblue py-1.5 px-3.5 font-medium tracking-tight text-white transition hover:bg-vistablue active:bg-chryslerblue dark:bg-vistablue dark:hover:bg-chryslerblue dark:active:bg-vistablue"
                {...nextButtonProps}
              >
                {isLastStep ? "Reservar" : nextButtonText}
              </button>
            </div>
          </div>
        ) : (
          // Si se completaron todos los pasos, mostramos el contenido final personalizado.
          <div className="p-8">{finalStepContent}</div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({
  isCompleted,
  currentStep,
  direction,
  children,
  className,
}) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? "-100%" : "100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? "50%" : "-50%",
    opacity: 0,
  }),
};

export function Step({ children }) {
  return <div className="px-8">{children}</div>;
}

function StepIndicator({ step, currentStep }) {
  const status =
    currentStep === step
      ? "active"
      : currentStep < step
      ? "inactive"
      : "complete";

  return (
    <motion.div
      className="relative outline-none cursor-default select-none"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: {
            scale: 1,
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            dark: {
              backgroundColor: "#374151", // dark:bg-gray-700
              color: "white",
              border: "2px solid #4B5563"
            }
          },
          active: {
            scale: 1,
            backgroundColor: "#1E40AF", // vistablue instead of chryslerblue (#531CB3)
            color: "white",
            border: "2px solid black",
          },
          complete: {
            scale: 1,
            backgroundColor: "#8AAADC",
            color: "white",
            border: "2px solid black",
          },
        }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center w-8 h-8 font-semibold rounded-full dark:border-gray-500"
      >
        {status === "complete" ? (
          <CheckIcon className="w-4 h-4 text-white" />
        ) : (
          <span className="text-sm">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: "transparent" },
    complete: { width: "100%", backgroundColor: "#8AAADC" },
  };

  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-neutral-600 dark:bg-neutral-400">
      <motion.div
        className="absolute top-0 left-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.1,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
