/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import type { PropertyFormData } from "@/types/property";
import LocationStep from "../form-step/LocationStep";
import FeaturesStep from "../form-step/FeaturesStep";
import DetailsStep from "../form-step/DetailsStep";
import DocumentsStep from "../form-step/DocumentStep";
import PhotosStep from "../form-step/PhotoStep";
import BusinessStep from "../form-step/BusinessStep";
import PersonalDataStep from "../form-step/PersonalData";
import Sidebar from "./PorpertySidebar";

export default function PropertyListingForm() {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<PropertyFormData>({
    defaultValues: {
      // Location
      country: "Portugal",
      district: "",
      county: "",
      parish: "",
      city: "",
      street: "",
      number_or_lot: "",
      floor_or_apartment: "",
      postal_code: "",

      // Features
      property_type: "apartment",
      number_of_rooms: 1,
      gross_area: 0,
      construction_year: new Date().getFullYear(),

      // Details
      condition: "new",
      has_garage: false,
      has_elevator: false,
      has_air_conditioning: false,
      has_private_garden: false,
      has_private_pool: false,
      has_storage: false,
      has_basement: false,
      has_terrace: false,

      // Business
      urgent_sale: "no",
      estimated_value: 0,

      // Personal Data
      contact_name: "",
      contact_surname: "",
      contact_email: "",
      contact_phone: "",
      observations: "",
      how_found: "",
      marketing_consent: false,
      terms_accepted: false,

      // Files
      documents: [],
      photos: [],
    },
    mode: "onChange",
  });

  const steps = [
    { id: "location", label: "Location", component: LocationStep },
    { id: "features", label: "Features", component: FeaturesStep },
    { id: "details", label: "Details", component: DetailsStep },
    { id: "documents", label: "Documents", component: DocumentsStep },
    { id: "photos", label: "Photos", component: PhotosStep },
    { id: "business", label: "Business", component: BusinessStep },
    {
      id: "personal-data",
      label: "Personal Data",
      component: PersonalDataStep,
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const goToNextStep = async () => {
    // Get validation fields for the current step
    const fieldsToValidate = getFieldsToValidate(currentStep);

    // Validate the current step's fields
    const isValid = await methods.trigger(fieldsToValidate as any);

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const getFieldsToValidate = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: // Location
        return ["country", "city", "street"];
      case 1: // Features
        return ["property_type", "number_of_rooms", "gross_area"];
      case 2: // Details
        return ["condition"];
      case 3: // Documents
        return []; // Documents are optional
      case 4: // Photos
        return []; // Photos are optional
      case 5: // Business
        return ["urgent_sale", "estimated_value"];
      case 6: // Personal Data
        return [
          "contact_name",
          "contact_surname",
          "contact_email",
          "contact_phone",
          "how_found",
          "terms_accepted",
        ];
      default:
        return [];
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    console.log(data);
  };

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <Sidebar
        steps={steps}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
      <div className='flex-1 p-6'>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className='max-w-4xl mx-auto'
          >
            <CurrentStepComponent
              onNext={goToNextStep}
              onPrevious={goToPreviousStep}
              isLastStep={currentStep === steps.length - 1}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
