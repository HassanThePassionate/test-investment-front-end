"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Star, FileText, Construction } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type DetailsStepProps = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
};

export default function DetailsStep({ onNext, onPrevious }: DetailsStepProps) {
  const { setValue, watch } = useFormContext<PropertyFormData>();

  const condition = watch("condition");

  const handleConditionSelect = (
    selectedCondition: "new" | "used" | "needs_renovation"
  ) => {
    setValue("condition", selectedCondition);
  };

  const features = [
    { id: "has_garage", label: "Garage" },
    { id: "has_elevator", label: "Elevator" },
    { id: "has_air_conditioning", label: "Air conditioning" },
    { id: "has_private_garden", label: "Private Garden" },
    { id: "has_private_pool", label: "Private Pool" },
    { id: "has_storage", label: "Attic" },
    { id: "has_basement", label: "Cave" },
    { id: "has_terrace", label: "Terrace" },
  ];

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold'>Details</h2>
        <p className='text-gray-600'>
          How would you describe your property according to its state of
          conservation?
        </p>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-3 gap-4'>
          <Card
            className={`cursor-pointer border-2 ${
              condition === "new" ? "border-teal-500" : "border-gray-200"
            }`}
            onClick={() => handleConditionSelect("new")}
          >
            <CardContent className='flex flex-col items-center justify-center p-6'>
              <Star className='h-10 w-10 mb-2' />
              <span>New</span>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 ${
              condition === "used" ? "border-teal-500" : "border-gray-200"
            }`}
            onClick={() => handleConditionSelect("used")}
          >
            <CardContent className='flex flex-col items-center justify-center p-6'>
              <FileText className='h-10 w-10 mb-2' />
              <span>Used</span>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer border-2 ${
              condition === "needs_renovation"
                ? "border-teal-500"
                : "border-gray-200"
            }`}
            onClick={() => handleConditionSelect("needs_renovation")}
          >
            <CardContent className='flex flex-col items-center justify-center p-6'>
              <Construction className='h-10 w-10 mb-2' />
              <span>To remodel</span>
            </CardContent>
          </Card>
        </div>

        <div>
          <Label className='mb-3 block'>Select other relevant features:</Label>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
            {features.map((feature) => (
              <div
                key={feature.id}
                className='flex items-center space-x-2 h-[44px] cursor-pointer border rounded-md p-3'
              >
                <Checkbox
                  id={feature.id}
                  onCheckedChange={(checked) => {
                    setValue(
                      feature.id as keyof PropertyFormData,
                      checked as boolean
                    );
                  }}
                />
                <Label htmlFor={feature.id}>{feature.label}</Label>
              </div>
            ))}
          </div>
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
