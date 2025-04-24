"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyFormData } from "@/types/property";

type LocationStepProps = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
};

export default function LocationStep({
  onNext,
  onPrevious,
}: LocationStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<PropertyFormData>();

  const handleSelectChange = (value: string) => {
    setValue("country", value);
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold'>Location</h2>
        <p className='text-gray-600'>
          Please indicate the location of your property so we can better
          evaluate your property.
        </p>
      </div>

      <div className='space-y-6'>
        <div>
          <Label htmlFor='country'>Country</Label>
          <Select
            defaultValue={watch("country")}
            onValueChange={handleSelectChange}
          >
            <SelectTrigger className='mt-2 w-full !h-[44px] !shadow-none'>
              <SelectValue placeholder='Select country' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Portugal'>Portugal</SelectItem>
              <SelectItem value='Spain'>Spain</SelectItem>
              <SelectItem value='France'>France</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.country.message}
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='district'>District</Label>
            <Input
              id='district'
              {...register("district")}
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='District'
            />
            {errors.district && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.district.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='county'>Council</Label>
            <Input
              id='county'
              {...register("county")}
              placeholder='Council'
              className='mt-2 w-full !h-[44px] !shadow-none'
            />
            {errors.county && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.county.message}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='parish'>Parish</Label>
            <Input
              id='parish'
              {...register("parish")}
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='Parish'
            />
            {errors.parish && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.parish.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='city'>City</Label>
            <Input
              id='city'
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='City'
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <p className='text-sm text-red-500 mt-1'>{errors.city.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor='street'>Street</Label>
          <Input
            id='street'
            className='mt-2 w-full !h-[44px] !shadow-none'
            placeholder='Street'
            {...register("street", { required: "Street is required" })}
          />
          {errors.street && (
            <p className='text-sm text-red-500 mt-1'>{errors.street.message}</p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='number_or_lot'>Number/Lot</Label>
            <Input
              id='number_or_lot'
              {...register("number_or_lot")}
              placeholder='Number or Lot'
              className='mt-2 w-full !h-[44px] !shadow-none'
            />
            {errors.number_or_lot && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.number_or_lot.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='floor_or_apartment'>Floor/Apartment</Label>
            <Input
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='Floor or Apartment'
              id='floor_or_apartment'
              {...register("floor_or_apartment")}
            />
            {errors.floor_or_apartment && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.floor_or_apartment.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor='postal_code'>Postal Code</Label>
          <Input
            id='postal_code'
            placeholder='####-###'
            className='mt-2 w-full !h-[44px] !shadow-none'
            {...register("postal_code")}
          />
          {errors.postal_code && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.postal_code.message}
            </p>
          )}
        </div>
      </div>

      <div className='flex justify-between pt-6'>
        <Button type='button' variant='outline' onClick={onPrevious} disabled>
          Previous
        </Button>
        <Button type='button' onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
