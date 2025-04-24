"use client";

import type React from "react";

import { useState } from "react";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { PropertyFormData } from "@/types/property";

interface DocumentsProps {
  property: PropertyFormData;
}

const Documents: React.FC<DocumentsProps> = ({ property }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to download all documents as a zip file
  const downloadAllDocuments = async () => {
    if (!property.documents || property.documents.length === 0) {
      alert("No documents available to download");
      return;
    }

    try {
      setIsDownloading(true);
      const zip = new JSZip();

      // Add each document to the zip file
      const filePromises = property.documents.map(async (doc) => {
        try {
          // Handle File objects that are already in memory
          if (doc.file instanceof File) {
            const arrayBuffer = await doc.file.arrayBuffer();
            return {
              name: doc.file,
              data: arrayBuffer,
            };
          }
          // Handle remote files with URLs
          else if (doc.file || doc.url || doc.document) {
            const fileUrl = doc.file || doc.url || doc.document;
            if (typeof fileUrl === "string") {
              const response = await fetch(fileUrl);
              if (!response.ok) throw new Error(`Failed to fetch ${fileUrl}`);
              const blob = await response.blob();

              // Extract filename from URL or use document type as fallback
              const urlParts = fileUrl.split("/");
              const fileName =
                urlParts[urlParts.length - 1] ||
                `${doc.document_type || "document"}.pdf`;

              return {
                name: fileName,
                data: blob,
              };
            }
          }
          return null;
        } catch (error) {
          console.error("Error processing document:", error);
          return null;
        }
      });

      const files = (await Promise.all(filePromises)).filter(Boolean);

      if (files.length === 0) {
        alert("No valid documents found to download");
        setIsDownloading(false);
        return;
      }

      // Add files to zip
      files.forEach((file) => {
        if (file) {
          zip.file("Zip-File", file.data);
        }
      });

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Use FileSaver to save the zip
      saveAs(content, `property-${property.id || "documents"}.zip`);
    } catch (error) {
      console.error("Error creating zip file:", error);
      alert("Failed to download documents. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <h1 className='text-2xl font-semibold mb-6 mt-3'>Documents</h1>

      <div className='space-y-4'>
        <div className='flex items-center justify-between py-4 border-b'>
          <h4 className='text-blue-600 text-sm'>Property Document</h4>
          <button
            onClick={downloadAllDocuments}
            disabled={isDownloading}
            className='px-4 py-2 border rounded hover:bg-[#f2f2f2] flex items-center gap-2 text-[#58626f] text-sm h-[40px] font-medium cursor-pointer border-[#c4c8cc] disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Download className='h-4 w-4' />
            {isDownloading ? "Downloading..." : "Download"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Documents;
