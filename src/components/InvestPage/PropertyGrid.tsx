/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/format-date";
import { getNestedValue } from "@/lib/get-nested-value";

// Define the PropertyFormData type
interface PropertyFormData {
  id: string;
  // Add other properties as needed
}

// Update the PropertyGridProps interface to include the same props as PropertyList
interface PropertyGridProps {
  properties: any[];
  sortField?: keyof PropertyFormData;
  sortDirection?: "asc" | "desc";
  onSort?: (field: keyof PropertyFormData) => void;
}

// Update the function signature to match the updated interface
export function PropertyGrid({
  properties,
}: // sortField,
// sortDirection,
// onSort,
PropertyGridProps) {
  // Track current image index for each property
  const [currentImageIndex, setCurrentImageIndex] = useState<
    Record<string, number>
  >({});

  // Track image loading state
  const [imageLoadState, setImageLoadState] = useState<Record<string, boolean>>(
    {}
  );

  // Get current image index for a property (default to 0)
  const getCurrentIndex = (propertyId: string) =>
    currentImageIndex[propertyId] || 0;

  // Navigate to previous image
  const prevImage = (propertyId: string, totalImages: number) => {
    if (totalImages <= 1) return;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: (prev[propertyId] - 1 + totalImages) % totalImages || 0,
    }));
  };

  // Navigate to next image
  const nextImage = (propertyId: string, totalImages: number) => {
    if (totalImages <= 1) return;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: ((prev[propertyId] || 0) + 1) % totalImages,
    }));
  };

  // Navigate to specific image
  const goToImage = (
    propertyId: string,
    index: number,
    totalImages: number
  ) => {
    if (totalImages <= 1) return;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [propertyId]: index,
    }));
  };

  // Handle image load success
  const handleImageLoad = (id: string) => {
    setImageLoadState((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Handle image load error
  const handleImageError = (id: string) => {
    setImageLoadState((prev) => ({
      ...prev,
      [id]: false,
    }));
  };

  // Function to get property images
  const getPropertyImages = (property: any) => {
    // Try to get images from different possible paths
    const images = [];

    // Try to get images array
    const imagesArray = getNestedValue(property, "images", []);
    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
      return imagesArray;
    }

    // Try individual image fields
    const mainImage = getNestedValue(property, "image");
    const photo = getNestedValue(property, "photo");
    const thumbnail = getNestedValue(property, "thumbnail");

    if (mainImage) images.push(mainImage);
    if (photo && photo !== mainImage) images.push(photo);
    if (thumbnail && thumbnail !== mainImage && thumbnail !== photo)
      images.push(thumbnail);

    return images.length > 0
      ? images
      : ["/placeholder.svg?height=192&width=384"];
  };

  // Function to get status badge color
  const getStatusBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-50 text-green-700 hover:bg-green-100";
      case "pending":
        return "bg-yellow-50 text-yellow-700 hover:bg-yellow-100";
      case "rejected":
        return "bg-red-50 text-red-700 hover:bg-red-100";
      default:
        return "bg-blue-50 text-blue-700 hover:bg-blue-100";
    }
  };

  const navigate = useNavigate();

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10 px-6'>
      {properties.map((property) => {
        const propertyId = getNestedValue(property, "id", "");
        const images = getPropertyImages(property);
        const currentIndex = getCurrentIndex(propertyId);
        const totalImages = images.length;
        const imageLoaded = imageLoadState[`${propertyId}-${currentIndex}`];

        // Calculate estimated value
        const estimatedValue =
          getNestedValue(property, "estimated_value") ||
          getNestedValue(property, "price") ||
          getNestedValue(property, "businessInfo.estimatedValue") ||
          0;

        // Calculate a random progress value for demonstration
        const progressValue = Math.floor(Math.random() * 100);

        return (
          <div
            key={propertyId}
            className='overflow-hidden flex flex-col border rounded-lg shadow-sm'
          >
            <div className='relative h-48'>
              <div className='absolute inset-0 bg-gray-100 flex items-center justify-center'>
                {(!images[currentIndex] || !imageLoaded) && (
                  <Home className='h-10 w-10 text-gray-400' />
                )}
              </div>

              {images[currentIndex] && (
                <img
                  src={images[currentIndex] || "/placeholder.svg"}
                  alt={`Property image ${currentIndex + 1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() =>
                    handleImageLoad(`${propertyId}-${currentIndex}`)
                  }
                  onError={() =>
                    handleImageError(`${propertyId}-${currentIndex}`)
                  }
                />
              )}

              <div className='absolute top-3 left-3 flex gap-2'>
                <Badge
                  variant='outline'
                  className={`font-medium uppercase ${getStatusBadgeClass(
                    getNestedValue(property, "status")
                  )}`}
                >
                  {getNestedValue(property, "status") || "Available"}
                </Badge>
                <Badge
                  variant='outline'
                  className='bg-white/90 text-gray-700 hover:bg-white font-medium'
                >
                  {getNestedValue(property, "property_type") ||
                    getNestedValue(property, "propertyType") ||
                    "Property"}
                </Badge>
              </div>

              {totalImages > 1 && (
                <>
                  <button
                    className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 transition-all duration-200 hover:scale-110'
                    onClick={(e) => {
                      e.preventDefault();
                      prevImage(propertyId, totalImages);
                    }}
                  >
                    <ChevronLeft className='h-5 w-5' />
                  </button>

                  <button
                    className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 transition-all duration-200 hover:scale-110'
                    onClick={(e) => {
                      e.preventDefault();
                      nextImage(propertyId, totalImages);
                    }}
                  >
                    <ChevronRight className='h-5 w-5' />
                  </button>

                  <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1'>
                    {Array.from({ length: totalImages }).map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          i === currentIndex
                            ? "bg-white scale-125"
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          goToImage(propertyId, i, totalImages);
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className='p-4 flex flex-col gap-3'>
              <div className='flex items-start justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='text-blue-600 font-semibold text-[13px]'>
                    #{propertyId}
                  </div>
                  <div className='font-semibold text-[13px]'>
                    {getNestedValue(property, "city")} -{" "}
                    {getNestedValue(property, "district")}
                  </div>
                </div>
                <Badge variant='outline' className='bg-gray-50 text-gray-700'>
                  {getNestedValue(property, "condition") || "Good"}
                </Badge>
              </div>

              <div className='text-xs text-muted-foreground'>
                Added:{" "}
                {getNestedValue(property, "created_at")
                  ? formatDate(getNestedValue(property, "created_at"))
                  : getNestedValue(property, "createdAt")
                  ? formatDate(getNestedValue(property, "createdAt"))
                  : "N/A"}
              </div>

              <div className='pt-1'>
                <Progress value={progressValue} className='h-2' />
              </div>

              <div className='flex justify-between text-xs'>
                <span className='font-medium'>
                  {getNestedValue(property, "street")}
                </span>
                <span className='text-muted-foreground flex items-center'>
                  Floor:{" "}
                  {getNestedValue(property, "floor_or_apartment") ||
                    getNestedValue(property, "floorApartment") ||
                    "N/A"}
                </span>
              </div>

              <div className='grid grid-cols-2 gap-x-6 gap-y-2 mt-1'>
                <div>
                  <div className='text-xs text-muted-foreground flex items-center'>
                    Estimated Value
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='h-3.5 w-3.5 ml-1 text-muted-foreground' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Estimated property value</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='font-medium text-sm mt-1'>
                    $
                    {typeof estimatedValue === "number"
                      ? estimatedValue.toLocaleString()
                      : estimatedValue}
                  </div>
                </div>

                <div>
                  <div className='text-xs mb-1 text-muted-foreground'>
                    Construction Year
                  </div>
                  <div className='font-medium text-xs'>
                    {getNestedValue(property, "construction_year") ||
                      getNestedValue(property, "constructionYear") ||
                      "N/A"}
                  </div>
                </div>

                <div>
                  <div className='text-xs mb-1 text-muted-foreground flex items-center'>
                    Gross Area
                  </div>
                  <div className='font-medium text-xs'>
                    {getNestedValue(property, "gross_area") ||
                      getNestedValue(property, "grossArea") ||
                      "N/A"}{" "}
                    m²
                  </div>
                </div>

                <div>
                  <div className='text-xs mb-1 text-muted-foreground flex items-center'>
                    Rooms
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='h-3.5 w-3.5 ml-1 text-muted-foreground' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Number of rooms</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className='font-medium text-xs'>
                    {getNestedValue(property, "number_of_rooms") ||
                      getNestedValue(property, "numberOfRooms") ||
                      "N/A"}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate(`/property-detail/${propertyId}`)}
                className='w-full bg-blue-600 hover:bg-blue-700 mt-2'
              >
                View Details
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
