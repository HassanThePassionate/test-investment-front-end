"use client";

import type React from "react";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { PropertyFormData, PhotoFile } from "@/types/property";
import { FileImage, X } from "lucide-react";
import { useState } from "react";

type PhotosStepProps = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
};

export default function PhotosStep({ onNext, onPrevious }: PhotosStepProps) {
  const { setValue, watch } = useFormContext<PropertyFormData>();
  const [dragActive, setDragActive] = useState(false);

  const photos = watch("photos") || [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newPhotos: PhotoFile[] = imageFiles.map((file, index) => ({
      file,
      order: photos.length + index,
    }));

    setValue("photos", [...photos, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);

    // Reorder remaining photos
    const reorderedPhotos = updatedPhotos.map((photo, idx) => ({
      ...photo,
      order: idx,
    }));

    setValue("photos", reorderedPhotos);
  };

  // Function to get the image URL for display
  const getPhotoUrl = (photo: PhotoFile): string => {
    if (photo.file instanceof File) {
      return URL.createObjectURL(photo.file);
    }

    // Return the URL from the server response
    return (
      photo.image ||
      photo.file_url ||
      photo.url ||
      "/placeholder.svg?height=160&width=240"
    );
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold'>Photos</h2>
        <p className='text-gray-600'>
          Show us your property! The photographs will allow us to confirm its
          condition and, therefore, adjust our offer.
        </p>
      </div>

      <div>
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center ${
            dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className='flex flex-col items-center justify-center space-y-3'>
            <FileImage className='h-10 w-10 text-gray-400' />
            <div className='text-gray-600'>
              <p className='font-medium'>.PNG .JPG .JPEG</p>
              <p>Click here to select photos</p>
            </div>
            <input
              id='photo-upload'
              type='file'
              multiple
              className='hidden'
              onChange={handleChange}
              accept='.png,.jpg,.jpeg'
            />
            <Button
              type='button'
              variant='outline'
              onClick={() => document.getElementById("photo-upload")?.click()}
            >
              Select Files
            </Button>
          </div>
        </div>

        {photos.length > 0 && (
          <div className='mt-6'>
            <Label className='mb-3 block'>Uploaded Photos</Label>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
              {photos.map((photo, index) => (
                <div key={index} className='relative group'>
                  <img
                    src={getPhotoUrl(photo) || "/placeholder.svg"}
                    alt={`Property photo ${index + 1}`}
                    className='w-full h-40 object-cover rounded-md'
                  />
                  <Button
                    type='button'
                    variant='destructive'
                    size='sm'
                    className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'
                    onClick={() => removePhoto(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
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
