"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PropertyFormData } from "@/types/property";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddProperties } from "@/api/propertiesAPI";
import { toast } from "react-toastify";
import { useState } from "react";

type PersonalDataStepProps = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
};

export default function PersonalDataStep({
  onPrevious,
}: PersonalDataStepProps) {
  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useFormContext<PropertyFormData>();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmitForm = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      const response = await AddProperties(data);
      console.log("Form submitted:", data);
      toast.success("Form submitted successfully!");

      if (!response.data) {
        throw new Error("Failed to submit property data");
      }
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleSelectChange = (value: string) => {
    setValue("how_found", value);
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold'>Enter your contact details</h2>
        <p className='text-gray-600'>
          Once you complete this page we will contact you.
        </p>
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='contact_name'>Name</Label>
            <Input
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='Name'
              id='contact_name'
              {...register("contact_name", { required: "Name is required" })}
            />
            {errors.contact_name && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.contact_name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='contact_surname'>Surname</Label>
            <Input
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='Surname'
              id='contact_surname'
              {...register("contact_surname", {
                required: "Surname is required",
              })}
            />
            {errors.contact_surname && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.contact_surname.message}
              </p>
            )}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <Label htmlFor='contact_email'>E-mail</Label>
            <Input
              id='contact_email'
              type='email'
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='E-mail'
              {...register("contact_email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.contact_email && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.contact_email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor='contact_phone'>Telephone</Label>
            <Input
              id='contact_phone'
              className='mt-2 w-full !h-[44px] !shadow-none'
              placeholder='Telephone'
              {...register("contact_phone", {
                required: "Phone number is required",
              })}
            />
            {errors.contact_phone && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.contact_phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor='observations'>Observations</Label>
          <Textarea
            id='observations'
            placeholder='Observations'
            {...register("observations")}
            className='min-h-[150px] mt-2 w-full !shadow-none'
          />
          {errors.observations && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.observations.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor='how_found'>How did you hear about Sell and Go?</Label>
          <Select
            onValueChange={handleSelectChange}
            defaultValue={watch("how_found")}
          >
            <SelectTrigger className='mt-2 !h-[44px]   !shadow-none'>
              <SelectValue placeholder='-- Select --' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='facebook'>Facebook</SelectItem>
              <SelectItem value='google'>Google</SelectItem>
              <SelectItem value='friend'>Friend</SelectItem>
              <SelectItem value='other'>Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.how_found && (
            <p className='text-sm text-red-500 mt-1'>
              {errors.how_found.message}
            </p>
          )}
        </div>

        <div className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='marketing_consent'
              onCheckedChange={(checked) => {
                setValue("marketing_consent", checked as boolean);
              }}
            />
            <Label htmlFor='marketing_consent' className='text-sm'>
              I agree to receive communications for advertising and marketing
              purposes.
            </Label>
          </div>

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='terms_accepted'
              onCheckedChange={(checked) => {
                setValue("terms_accepted", checked as boolean);
              }}
            />
            <Label htmlFor='terms_accepted' className='text-sm'>
              I have read and accept the Terms and Privacy Policy
            </Label>
            {errors.terms_accepted && (
              <p className='text-sm text-red-500 mt-1'>
                {errors.terms_accepted.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='flex justify-between pt-6'>
        <Button type='button' variant='outline' onClick={onPrevious}>
          Previous
        </Button>
        <Button type='submit' onClick={onSubmitForm} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
