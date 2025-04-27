/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropertyFormData } from '@/types/property';
import axios from './axiosInstance';
import { debugFormData } from '@/lib/debug-formdata';
import axiosInstance from './axiosInstance';

export const AddProperties = async (data: PropertyFormData) => {
  try {
    // Create a FormData object to handle file uploads
    const formData = new FormData()

    // Add all non-file fields to formData
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "photos" && key !== "documents") {
        if (typeof value === "boolean") {
          formData.append(key, value ? "true" : "false")
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      }
    })

    // Add photos to formData - IMPORTANT: Match exactly what your Django backend expects
    if (data.photos && data.photos.length > 0) {
      // For each photo, append the file to the photos field
      data.photos.forEach((photo) => {
        if (photo.file) {
          formData.append("photos", photo.file)
        }
      })

      // Append all orders as a separate array
      // This matches Django's handling of multiple values for the same field name
      data.photos.forEach((photo) => {
        formData.append("photo_orders", String(photo.order || 0))
      })
    }

    // Add documents to formData - IMPORTANT: Match exactly what your Django backend expects
    if (data.documents && data.documents.length > 0) {
      // For each document, append the file to the documents field
      data.documents.forEach((doc) => {
        if (doc.file) {
          formData.append("documents", doc.file)
        }
      })

      // Append all document types as a separate array
      data.documents.forEach((doc) => {
        formData.append("document_types", doc.document_type || "CPU")
      })
    }

    // Log the FormData to debug
    console.log("FormData contents:", debugFormData(formData))

    // Use multipart/form-data for file uploads
    const response = await axiosInstance.post("api/properties/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    console.log("Response from server:", response.data)
    return response
  } catch (error) {
    console.error("Error adding property:", error)
    throw error
  }
}
export const getProperties = async () => {
  try {
    const response = await axios.get('api/properties/properties_by_status/');
    return response.data.properties;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getAllProperties = async () => {
  try {
    const response = await axios.get('api/properties/public_properties/');
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
export const getAdminProperties = async () => {
  try {
    const response = await axios.get('api/properties/properties_by_status/');
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};
export const changePropertyStatus = async (
  id: number,
  status: 'pending' | 'rejected' | 'active'
): Promise<any> => {
  try {
    const response = await axios.patch(`api/properties/${id}/update_status/`, { status });
    return response.data.properties;
  } catch (error) {
    console.error(`Error updating property  status for property ${id}:`, error);
    throw error;
  }
};
export const deletePropertyUser = async (id: number) => {
  try {
    const response = await axios.delete(`api/properties/${id}/delete_property/`);
    return response.data.properties;
  } catch (error) {
    console.error(`Error deleting property with id ${id}:`, error);
    throw error;
  }
};