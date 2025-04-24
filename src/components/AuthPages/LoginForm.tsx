"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordInput } from "./PasswordInput";
import Heading from "./Heading";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "@/api/userAPI";
import { toast } from "react-toastify";

// Form validation schema
const loginFormSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  console.log(import.meta.env.VITE_API_URL);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const response = await loginUser(data);
      const user = response.data;

      // Save token
      localStorage.setItem("token", user.token);

      // Role-based navigation
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "user" && user.status === "active") {
        navigate("/dashboard");
      } else if (user.status === "cancelled") {
        setLoginError("You are not eligible to login.");
      } else {
        setLoginError("Your account is not active. Please contact support.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg =
        error.response?.data?.non_field_errors?.[0] || "Something went wrong";
      toast.error(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='w-full max-w-[500px] mx-auto mt-12 bg-[#F2F9F699] p-7 rounded-[24px] shadow-sm'>
      <Heading title='Login na Dashboard' />

      {loginError && (
        <Alert variant='destructive' className='mb-4'>
          <AlertDescription>{loginError}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-8'>
        <div className='grid grid-cols-1  gap-4'>
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
            <Label htmlFor='password'>Password:</Label>
            <PasswordInput
              id='password'
              placeholder='robertocalors042#@'
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className='text-sm text-red-500'>{errors.password.message}</p>
            )}
          </div>
        </div>

        <Button
          type='submit'
          className='w-full bg-[#23614E] hover:bg-[#23614ed8] mt-4 text-white cursor-pointer h-[56px] rounded-[20px]'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Processando...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className='text-base mt-3 font-medium text-center'>
        Don’t have an account?{" "}
        <Link
          to='/register'
          className='text-[#23614E] underline hover:text-[#23614ed0]'
        >
          Register
        </Link>
      </div>
    </div>
  );
}
