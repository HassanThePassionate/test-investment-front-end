"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";

type BusinessStepProps = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
};

export default function BusinessStep({
  onNext,
  onPrevious,
}: BusinessStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PropertyFormData>();

  const urgentSale = watch("urgent_sale");

  const handleUrgencySelect = (isUrgent: "yes" | "no") => {
    setValue("urgent_sale", isUrgent);
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold'>Business</h2>
        <p className='text-gray-600'>
          Our commitment is to present a proposal to interested parties within
          48 hours and close the deal quickly. We also want to know how urgent
          it is and the amount you consider appropriate for this to happen.
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <Label className='mb-2 block'>
            Are you in a hurry to sell your house? (select)
          </Label>
          <div className='grid grid-cols-2 gap-4'>
            <Card
              className={`cursor-pointer border-2 ${
                urgentSale === "yes" ? "border-teal-500" : "border-gray-200"
              }`}
              onClick={() => handleUrgencySelect("yes")}
            >
              <CardContent className='flex items-center justify-center p-6'>
                <span>Try</span>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer border-2 ${
                urgentSale === "no" ? "border-teal-500" : "border-gray-200"
              }`}
              onClick={() => handleUrgencySelect("no")}
            >
              <CardContent className='flex items-center justify-center p-6'>
                <span>No</span>
              </CardContent>
            </Card>
          </div>
          {errors.urgent_sale && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.urgent_sale.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor='estimated_value'>Estimated value of the house?</Label>
          <div className='relative'>
            <Input
              id='estimated_value'
              type='number'
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='200,000'
              {...register("estimated_value", {
                valueAsNumber: true,
                required: "Estimated value is required",
                min: { value: 1, message: "Value must be greater than 0" },
              })}
            />
            <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
              €
            </div>
          </div>
          {errors.estimated_value && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.estimated_value.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex justify-between pt-6'>
        <Button type='button' variant='outline' onClick={onPrevious}>
          Previous
        </Button>
        <Button type='button' onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
