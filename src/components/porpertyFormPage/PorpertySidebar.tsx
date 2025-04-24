/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import {
  MapPin,
  LayoutGrid,
  FileText,
  FileImage,
  DollarSign,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  label: string;
  component: React.ComponentType<any>;
};

type SidebarProps = {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
};

export default function Sidebar({
  steps,
  currentStep,
  setCurrentStep,
}: SidebarProps) {
  const getIcon = (id: string) => {
    switch (id) {
      case "location":
        return <MapPin className='h-5 w-5' />;
      case "features":
      case "details":
        return <LayoutGrid className='h-5 w-5' />;
      case "documents":
        return <FileText className='h-5 w-5' />;
      case "photos":
        return <FileImage className='h-5 w-5' />;
      case "business":
        return <DollarSign className='h-5 w-5' />;
      case "personal-data":
        return <User className='h-5 w-5' />;
      default:
        return null;
    }
  };

  return (
    <div className='w-64 bg-gray-900 text-white p-4'>
      <h1 className='text-xl font-bold mb-8 px-2'>Sell your property</h1>
      <nav>
        <ul className='space-y-2'>
          {steps.map((step, index) => (
            <li key={step.id}>
              <button
                type='button'
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "flex items-center gap-3 w-full p-3 rounded-md transition-colors",
                  index === currentStep
                    ? "bg-teal-600 text-white"
                    : "hover:bg-gray-800"
                )}
              >
                {getIcon(step.id)}
                <span>{step.label}</span>
                {index < currentStep && (
                  <span className='ml-auto text-teal-400'>✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
