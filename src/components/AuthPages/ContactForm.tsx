"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import { Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { PhoneInput } from "./PhoneInput";
import { PasswordInput } from "./PasswordInput";
import { submitContactForm } from "@/lib/form-action";
import Heading from "./Heading";
import { Link } from "react-router-dom";
import { registerUser } from "@/api/userAPI";

// Form validation schema
const formSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone_number: z.string().min(9, { message: "Número de telefone inválido" }),
  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  location: z.string().min(2, { message: "Localização é obrigatória" }),
  occupation: z.string().min(2, { message: "Objetivo é obrigatório" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("+351");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
      location: "",
      occupation: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formattedData = {
        ...data,
        phone_number: `${countryCode}${data.phone_number.replace(/\s+/g, "")}`,
      };
      await registerUser(formattedData);

      await submitContactForm(formattedData);
      setSubmitSuccess(true);
      reset();

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 15000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.email) {
        setSubmitError("This email is already registered.");
      } else if (error.response?.data?.phone_number) {
        setSubmitError(error.response.data.phone_number[0]);
      } else {
        setSubmitError(
          "An error occurred while submitting the form. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const objectiveOptions = [
    "investment_finder",
    "investor",
    "partnership",
    "others",
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-6 bg-[#F2F9F699] p-7 rounded-[24px] lg:max-w-[45%] shadow-sm'
    >
      <Heading title='Junta-te a nós' />
      {submitSuccess && (
        <Alert className='bg-green-50 border-green-200 text-green-800'>
          <CheckCircle2 className='h-4 w-4 text-green-600' />
          <AlertDescription>
            You account has been created. But Not activated Waiting for approval
            and then go to login
          </AlertDescription>
        </Alert>
      )}

      {submitError && (
        <Alert variant='destructive'>
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className='space-y-2'>
        <Label htmlFor='full_name'>Nome Completo:</Label>
        <Input
          id='full_name'
          placeholder='António Maria Santos e Silva'
          {...register("full_name")}
          aria-invalid={errors.full_name ? "true" : "false"}
          className='bg-white h-[52px] rounded-[12px] shadow-none'
        />
        {errors.full_name && (
          <p className='text-sm text-red-500'>{errors.full_name.message}</p>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email Address:*</Label>
          <Input
            id='email'
            type='email'
            placeholder='antoniomariappt@gmail.com'
            {...register("email")}
            aria-invalid={errors.email ? "true" : "false"}
            required
            className='bg-white h-[52px] rounded-[12px] shadow-none'
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone_number'>Phone Number:*</Label>
          <PhoneInput
            id='phone_number'
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            {...register("phone_number")}
            placeholder='933 587 994'
            aria-invalid={errors.phone_number ? "true" : "false"}
            required
          />
          {errors.phone_number && (
            <p className='text-sm text-red-500'>
              {errors.phone_number.message}
            </p>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password:*</Label>
        <PasswordInput
          id='password'
          placeholder='Enter your password'
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
          required
        />
        {errors.password && (
          <p className='text-sm text-red-500'>{errors.password.message}</p>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='location'>Localização:*</Label>
          <Input
            id='location'
            placeholder='Lisboa'
            {...register("location")}
            aria-invalid={errors.location ? "true" : "false"}
            required
            className='bg-white h-[52px] rounded-[12px] shadow-none'
          />
          {errors.location && (
            <p className='text-sm text-red-500'>{errors.location.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='occupation'>Qual é o teu objetivo:*</Label>
          <Select
            onValueChange={(value) => {
              const event = {
                target: { name: "occupation", value },
              } as React.ChangeEvent<HTMLSelectElement>;
              register("occupation").onChange(event);
            }}
          >
            <SelectTrigger
              className='bg-white cursor-pointer !h-[52px] rounded-[12px] shadow-none w-full truncate'
              id='occupation'
              aria-invalid={errors.occupation ? "true" : "false"}
            >
              <SelectValue placeholder='Investor or Seeking Opportunities' />
            </SelectTrigger>
            <SelectContent>
              {objectiveOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.occupation && (
            <p className='text-sm text-red-500'>{errors.occupation.message}</p>
          )}
        </div>
      </div>

      <Button
        type='submit'
        className='w-full bg-[#23614E] hover:bg-[#23614ed8] text-white cursor-pointer h-[56px] rounded-[20px] mt-4'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />A enviar...
          </>
        ) : (
          "Enviar Contacto"
        )}
      </Button>
      <div className='text-base  font-medium text-center'>
        If you have already account?{" "}
        <Link
          to='/login'
          className='text-[#23614E] underline hover:text-[#23614ed0]'
        >
          Login
        </Link>
      </div>
    </form>
  );
}
