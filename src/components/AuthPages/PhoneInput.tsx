"use client";

import React, { useMemo } from "react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import "flag-icons/css/flag-icons.min.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getCountries } from "@/lib/get-countries";

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  countryCode: string;
  onCountryCodeChange: (value: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ countryCode, onCountryCodeChange, className, ...props }, ref) => {
    const countries = useMemo(() => getCountries(), []);

    return (
      <div className='flex'>
        <Select value={countryCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger
            className={cn(
              "w-[115px] cursor-pointer !rounded-r-none border-r-0 shadow-none bg-white !h-[52px] rounded-[12px]",
              className
            )}
          >
            <SelectValue placeholder='91' />
          </SelectTrigger>
          <SelectContent className='max-h-[300px] overflow-y-auto'>
            {countries.map((c, i) => (
              <SelectItem key={i} value={c.dialCode}>
                <div className='flex items-center gap-2'>
                  <span className={`fi fi-${c.code} h-4 w-6 rounded-sm`}></span>
                  <span>{c.dialCode}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type='tel'
          className='!rounded-l-none flex-1 shadow-none bg-white !h-[52px] rounded-[12px]'
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
