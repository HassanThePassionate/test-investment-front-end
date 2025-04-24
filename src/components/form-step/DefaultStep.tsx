import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface DefaultStepProps {
  title: string;
  onNext: () => void;
  onPrevious: () => void;
}

const DefaultStep: React.FC<DefaultStepProps> = ({
  title,
  onNext,
  onPrevious,
}) => {
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setIsFormSubmitting(true);

    // Simulate a form validation/submission process
    setTimeout(() => {
      // For the DefaultStep, we'll simulate a validation error
      // to demonstrate the error handling
      const hasError = Math.random() > 0.5; // 50% chance of error for demo

      if (hasError) {
        setError("Please complete all required fields before proceeding.");
        setIsFormSubmitting(false);
      } else {
        setError(null);
        onNext();
        setIsFormSubmitting(false);
      }
    }, 500);
  };

  return (
    <div className='space-y-6 py-8'>
      <div>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <p className='text-muted-foreground mt-2'>
          This step is not yet implemented.
        </p>
      </div>

      {error && (
        <Alert variant='destructive' className='border-red-500'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className='bg-muted/40 rounded-md p-8 flex items-center justify-center h-64'>
        <p className='text-muted-foreground text-lg'>Coming soon...</p>
      </div>

      <div className='flex justify-between pt-4'>
        <Button
          type='button'
          onClick={onPrevious}
          variant='outline'
          className='gap-2'
        >
          <ArrowLeft /> Previous
        </Button>
        <Button
          onClick={handleNext}
          className='gap-2'
          disabled={isFormSubmitting}
        >
          Next <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default DefaultStep;
