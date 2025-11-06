// SVG Icons
function CheckIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function Stepper({ steps, currentStep }) {
  return (
    <div className="w-full py-6 sm:py-8">
      <div className="flex items-center justify-center max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center w-full">
              <div
                className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 transition-all ${
                  currentStep > step.id
                    ? 'border-[#6CA6CD] text-white'
                    : currentStep === step.id
                    ? 'border-[#6CA6CD] text-[#6CA6CD]'
                    : 'dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)] dark:text-gray-400 text-gray-500'
                }`}
                style={{
                  backgroundColor: currentStep > step.id ? '#6CA6CD' : currentStep === step.id ? 'rgba(108, 166, 205, 0.1)' : undefined
                }}
              >
                {currentStep > step.id ? (
                  <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <span className="font-semibold text-sm sm:text-base">{step.id}</span>
                )}
              </div>
              <div className="mt-3 text-center">
                <p
                  className={`text-xs sm:text-sm font-medium ${
                    currentStep >= step.id
                      ? 'dark:text-gray-200 text-gray-900'
                      : 'dark:text-gray-400 text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs dark:text-gray-400 text-gray-500 mt-1 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-2 sm:mx-4 h-0.5 flex-1 transition-all ${
                  currentStep > step.id 
                    ? 'bg-[#6CA6CD]' 
                    : 'dark:bg-[rgba(108,166,205,0.25)] bg-[rgba(108,166,205,0.15)]'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stepper;

