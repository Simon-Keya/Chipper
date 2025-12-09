interface CheckoutStepsProps {
    currentStep: number;
    steps: string[];
  }
  
  export default function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
    return (
      <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              index < currentStep 
                ? 'bg-primary text-primary-content' 
                : index === currentStep 
                ? 'bg-base-300 text-base-content border border-base-content/30' 
                : 'bg-base-200 text-base-content/50'
            }`}>
              {index + 1}
            </div>
            <span className={`text-sm font-medium ${
              index < currentStep ? 'text-primary' : 'text-base-content/50'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>
    );
  }