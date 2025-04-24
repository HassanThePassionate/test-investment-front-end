"use client";

import type React from "react";

import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className={cn("relative", className)}>
        <Input
          type={showPassword ? "text" : "password"}
          className='pr-10 bg-white h-[52px] rounded-[12px] shadow-none'
          ref={ref}
          {...props}
        />
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute right-0 top-0 h-full cursor-pointer px-3 pr-6 py-2 hover:bg-transparent'
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className='h-5 w-5 text-gray-500' />
          ) : (
            <Eye className='h-5 w-5 text-gray-500' />
          )}
        </Button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
