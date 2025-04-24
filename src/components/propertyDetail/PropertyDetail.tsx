/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import style from "./property.module.css";
import Stats from "./Stats";
import RiskAssessment from "./RiskAssessment";
// import LoanTerms from "./LoanTerms";
// import Documents from "./Documents";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Slider from "./Slider";
import { PropertyFormData } from "@/types/property";
import { getAllProperties } from "@/api/propertiesAPI";
import Documents from "./Documents";

const PropertyLoanDetails: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [propertyData, setPropertyData] = useState<PropertyFormData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  // Extract propertyId from URL parameters
  const { propertyId } = useParams();

  const pathname = location.pathname;
  if (pathname.includes("property-detail"))
    document.body.style.background = "white";

  useEffect(() => {
    let isMounted = true;
    setMounted(true);

    // Fetch all properties and filter to find the specific one
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all properties
        const response = await getAllProperties();
        console.log("API Response:", response.data);

        if (isMounted) {
          // Find the property with matching ID
          const foundProperty = response.data?.find(
            (property: any) =>
              property.id?.toString() === propertyId ||
              (property as any)._id?.toString() === propertyId ||
              (property as any).propertyId?.toString() === propertyId
          );

          if (foundProperty) {
            setPropertyData(foundProperty);
          } else {
            setError("Property not found");
          }
        }
      } catch (error: any) {
        console.error("Error fetching property data:", error);
        if (isMounted) {
          if (error.response?.status === 401) {
            setError("You need to be logged in to view this property");
          } else {
            setError("Failed to load property details. Please try again.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (propertyId) {
      fetchPropertyData();
    }

    return () => {
      // This will run when the component unmounts
      isMounted = false;
    };
  }, [propertyId]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='animate-pulse flex flex-col items-center'>
          <div className='h-8 w-64 bg-gray-200 rounded mb-4'></div>
          <div className='h-64 w-full max-w-[888px] bg-gray-200 rounded mb-4'></div>
          <div className='h-32 w-full max-w-[888px] bg-gray-200 rounded'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='text-red-500 text-center'>
          <p className='text-xl font-semibold mb-2'>Error</p>
          <p>{error}</p>
          {error === "You need to be logged in to view this property" && (
            <button
              onClick={() =>
                navigate("/login", { state: { from: location.pathname } })
              }
              className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Login
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className='mt-4 ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!propertyData) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-xl font-semibold mb-2'>Property Not Found</p>
          <p>
            The property you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className='mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Extract property details for display
  const propertyTitle =
    (propertyData as any).title ||
    (propertyData as any).name ||
    `${propertyData.property_type} in ${propertyData.city}`;

  // Prepare images array for slider

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex-col flex gap-4'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-1 text-[#8e959e] max-w-[200px] text-base cursor-pointer hover:underline'
        >
          <ChevronLeft className='h-6 w-6' />
          Back
        </button>
        <h1 className='text-[28px] leading-[36px] font-semibold'>
          {propertyTitle}
        </h1>
      </div>

      {/* Image Slider */}
      <div className='max-w-[888px] flex flex-col gap-6'>
        <div className={style.box}>
          <Slider images={propertyData.photos} property={propertyData} />

          <Stats property={propertyData} />
        </div>

        <RiskAssessment property={propertyData} />

        {/* Tabs */}
        <Tabs
          defaultValue='project-info'
          className='block !justify-start mt-6 mb-6'
        >
          <TabsList className='w-full flex justify-start gap-6 flex-wrap mb-12 bg-transparent'>
            <TabsTrigger
              value='project-info'
              className='!bg-transparent !shadow-none cursor-pointer'
            >
              Property information
            </TabsTrigger>

            <TabsTrigger
              value='documents'
              className='!bg-transparent !shadow-none cursor-pointer'
            >
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value='project-info' className='p-4 mt-5'>
            <div className='mt-6 text-base'>
              <h3 className='font-medium mb-2 text-base'>
                Property Information
              </h3>
              <p className='text-base mb-3'>
                {propertyData.observations ||
                  `This property is located in ${propertyData.city}, ${propertyData.district}, at 
                 ${propertyData.street} ${propertyData.number_or_lot}, a well-connected residential area.`}
              </p>

              <h3 className='font-semibold my-4 text-lg'>Property Details:</h3>
              <ul className='space-y-2 text-base'>
                <li>
                  <strong>Type:</strong>{" "}
                  {propertyData.property_type === "apartment"
                    ? "Apartment"
                    : "House"}
                </li>
                <li>
                  <strong>Rooms:</strong> {propertyData.number_of_rooms}
                </li>
                <li>
                  <strong>Area:</strong> {propertyData.gross_area} m²
                </li>
                <li>
                  <strong>Floor/Apartment:</strong>{" "}
                  {propertyData.floor_or_apartment}
                </li>
                <li>
                  <strong>Condition:</strong>{" "}
                  {propertyData.condition === "new"
                    ? "New"
                    : propertyData.condition === "used"
                    ? "Used"
                    : "Needs Renovation"}
                </li>
              </ul>

              <h3 className='font-semibold my-4 text-lg'>Building Details:</h3>
              <ul className='space-y-2 text-base'>
                <li>
                  <strong>Construction Year:</strong>{" "}
                  {propertyData.construction_year}
                </li>
                <li>
                  <strong>Features:</strong>{" "}
                  {[
                    propertyData.has_garage ? "Garage" : null,
                    propertyData.has_elevator ? "Elevator" : null,
                    propertyData.has_air_conditioning
                      ? "Air Conditioning"
                      : null,
                    propertyData.has_private_garden ? "Private Garden" : null,
                    propertyData.has_private_pool ? "Private Pool" : null,
                    propertyData.has_storage ? "Storage" : null,
                    propertyData.has_basement ? "Basement" : null,
                    propertyData.has_terrace ? "Terrace" : null,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No special features"}
                </li>
              </ul>

              <h3 className='font-semibold my-4 text-lg'>Location:</h3>
              <ul className='space-y-2 text-base'>
                <li>
                  <strong>Address:</strong>{" "}
                  {`${propertyData.street} ${propertyData.number_or_lot}, ${propertyData.floor_or_apartment}`}
                </li>
                <li>
                  <strong>City:</strong> {propertyData.city}
                </li>
                <li>
                  <strong>District:</strong> {propertyData.district}
                </li>
                <li>
                  <strong>County:</strong> {propertyData.county}
                </li>
                <li>
                  <strong>Parish:</strong> {propertyData.parish}
                </li>
                <li>
                  <strong>Postal Code:</strong> {propertyData.postal_code}
                </li>
                <li>
                  <strong>Country:</strong> {propertyData.country}
                </li>
              </ul>

              {propertyData.urgent_sale === "yes" && (
                <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-md'>
                  <p className='text-red-600 font-medium'>
                    This property is marked for urgent sale!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value='documents' className='p-4'>
            <Documents property={propertyData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PropertyLoanDetails;
