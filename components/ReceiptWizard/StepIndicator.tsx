import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Step {
    id: number;
    title: string;
    description: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
    return (
        <div className="w-full py-6 px-4 bg-white border-b border-neutral-200">
            <div className="max-w-4xl mx-auto">
                {/* Desktop Progress Bar */}
                <div className="hidden md:flex items-center justify-between">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex flex-col items-center flex-1">
                                {/* Circle */}
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300",
                                        currentStep > step.id
                                            ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg"
                                            : currentStep === step.id
                                                ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg scale-110"
                                                : "bg-neutral-200 text-neutral-500"
                                    )}
                                >
                                    {currentStep > step.id ? (
                                        <Check size={24} className="animate-in zoom-in duration-200" />
                                    ) : (
                                        step.id
                                    )}
                                </div>

                                {/* Labels */}
                                <div className="mt-3 text-center">
                                    <p
                                        className={cn(
                                            "text-sm font-semibold transition-colors",
                                            currentStep >= step.id ? "text-neutral-900" : "text-neutral-400"
                                        )}
                                    >
                                        {step.title}
                                    </p>
                                    <p
                                        className={cn(
                                            "text-xs mt-0.5 transition-colors",
                                            currentStep >= step.id ? "text-neutral-600" : "text-neutral-400"
                                        )}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-1 mx-4 -mt-12 relative">
                                    <div className="absolute inset-0 bg-neutral-200 rounded-full" />
                                    <div
                                        className={cn(
                                            "absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500",
                                            currentStep > step.id ? "w-full" : "w-0"
                                        )}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Mobile Compact View */}
                <div className="md:hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-lg font-bold text-neutral-900">
                                {steps[currentStep - 1]?.title}
                            </p>
                            <p className="text-sm text-neutral-600">
                                Etapa {currentStep} de {steps.length}
                            </p>
                        </div>
                        <div
                            className={cn(
                                "w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl",
                                "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg"
                            )}
                        >
                            {currentStep}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-600 transition-all duration-500"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
