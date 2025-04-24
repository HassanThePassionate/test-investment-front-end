"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PropertyFormData } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Home } from "lucide-react";

type FeaturesStepProps = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
};

export default function FeaturesStep({
  onNext,
  onPrevious,
}: FeaturesStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PropertyFormData>();

  const propertyType = watch("property_type");
  const numberOfRooms = watch("number_of_rooms");

  const handlePropertyTypeSelect = (type: "apartment" | "house") => {
    setValue("property_type", type);
  };

  const handleRoomSelect = (rooms: number) => {
    setValue("number_of_rooms", rooms);
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold'>Features</h2>
        <p className='text-gray-600'>
          Describe your property according to its attributes such as number of
          bedrooms, areas and year of construction.
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <Label className='mb-2 block'>Property Type</Label>
          <div className='grid grid-cols-2 gap-4'>
            <Card
              className={`cursor-pointer border-2 ${
                propertyType === "apartment"
                  ? "border-teal-500"
                  : "border-gray-200"
              }`}
              onClick={() => handlePropertyTypeSelect("apartment")}
            >
              <CardContent className='flex flex-col items-center justify-center p-6'>
                <Building className='h-10 w-10 mb-2' />
                <span>Apartment</span>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer border-2 ${
                propertyType === "house" ? "border-teal-500" : "border-gray-200"
              }`}
              onClick={() => handlePropertyTypeSelect("house")}
            >
              <CardContent className='flex flex-col items-center justify-center p-6'>
                <Home className='h-10 w-10 mb-2' />
                <span>Housing</span>
              </CardContent>
            </Card>
          </div>
          {errors.property_type && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.property_type.message}
            </p>
          )}
        </div>

        <div>
          <Label className='block mb-2'>Number of Rooms (select)</Label>
          <div className='grid grid-cols-8 gap-2'>
            {[0, 1, 2, 3, 4, 5, 6, "7+"].map((room, index) => (
              <Button
                key={index}
                type='button'
                variant={
                  numberOfRooms === (typeof room === "string" ? 7 : room)
                    ? "default"
                    : "outline"
                }
                className='h-12'
                onClick={() =>
                  handleRoomSelect(typeof room === "string" ? 7 : room)
                }
              >
                {room}
              </Button>
            ))}
          </div>
          {errors.number_of_rooms && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.number_of_rooms.message}
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='gross_area'>Gross Area</Label>
            <div className='relative'>
              <Input
                id='gross_area'
                type='number'
                placeholder='100'
                className='mt-2 w-full !h-[44px] !shadow-none'
                {...register("gross_area", {
                  valueAsNumber: true,
                  required: "Gross area is required",

                  min: { value: 1, message: "Area must be greater than 0" },
                })}
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                m²
              </div>
            </div>
            {errors.gross_area && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.gross_area.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='construction_year'>Year of Construction</Label>
            <Input
              id='construction_year'
              type='number'
              placeholder='2005'
              className='mt-2 w-full !h-[44px] !shadow-none'
              {...register("construction_year", {
                valueAsNumber: true,
                min: { value: 1800, message: "Year must be valid" },
                max: {
                  value: new Date().getFullYear(),
                  message: "Year cannot be in the future",
                },
              })}
            />
            {errors.construction_year && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.construction_year.message}
              </p>
            )}
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
