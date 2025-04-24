"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{
    id?: number;
    image?: string;
    file_url?: string;
    url?: string;
  }>;
  initialIndex?: number;
}

export function ImageDialog({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ImageDialogProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const currentImage = images[currentIndex];
  const imageUrl =
    currentImage?.image ||
    currentImage?.file_url ||
    currentImage?.url ||
    "/placeholder.svg?height=600&width=800";

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = imageUrl;

    // Extract filename from URL or use a default name
    const filename =
      imageUrl.split("/").pop() || `image-${currentIndex + 1}.jpg`;
    link.setAttribute("download", filename);

    // Append to body, click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!images.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm'>
        <div className='relative flex flex-col'>
          <div className='absolute top-2 right-2 z-10 flex gap-2'>
            <Button
              variant='default'
              onClick={handleDownload}
              className='rounded-md bg-primary hover:bg-primary/90'
            >
              <Download className='h-5 w-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              onClick={onClose}
              className='rounded-full bg-background/80 hover:bg-background'
            >
              <X className='h-5 w-5' />
              <span className='sr-only'>Close</span>
            </Button>
          </div>

          <div className='relative aspect-[4/3] w-full overflow-hidden mt-12'>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={`Property image ${currentIndex + 1}`}
              className='h-full w-full object-contain'
            />

            <Button
              variant='ghost'
              size='icon'
              className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background'
              onClick={handlePrevious}
            >
              <ChevronLeft className='h-6 w-6' />
              <span className='sr-only'>Previous image</span>
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background'
              onClick={handleNext}
            >
              <ChevronRight className='h-6 w-6' />
              <span className='sr-only'>Next image</span>
            </Button>
          </div>

          <div className='p-4 border-t'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Image {currentIndex + 1} of {images.length}
              </div>
              <Button variant='outline' size='sm' onClick={handleDownload}>
                <Download className='h-4 w-4 mr-2' />
                Download
              </Button>
            </div>

            <div className='mt-4 flex gap-2 overflow-x-auto pb-2'>
              {images.map((image, idx) => (
                <button
                  key={idx}
                  className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                    idx === currentIndex
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentIndex(idx)}
                >
                  <img
                    src={
                      image.image ||
                      image.file_url ||
                      image.url ||
                      "/placeholder.svg?height=64&width=64"
                    }
                    alt={`Thumbnail ${idx + 1}`}
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
