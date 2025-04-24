"use client";

import type React from "react";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { PropertyFormData, DocumentFile } from "@/types/property";
import { FileUp, X, AlertCircle, FileText } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type DocumentsStepProps = {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
};

export default function DocumentsStep({
  onNext,
  onPrevious,
}: DocumentsStepProps) {
  const { setValue, watch } = useFormContext<PropertyFormData>();
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const documents = watch("documents") || [];

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
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setError(null);

    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const isValidDocumentType = (file: File): boolean => {
    // Only allow PDF files for documents
    const allowedTypes = [
      "application/pdf", // PDF
      "application/msword", // DOC
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/vnd.ms-excel", // XLS
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
      "text/plain", // TXT
      "application/rtf", // RTF
      "application/vnd.ms-powerpoint", // PPT
      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
    ];

    return allowedTypes.includes(file.type);
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);

    // Check if all files are valid document types
    const invalidFiles = fileArray.filter((file) => !isValidDocumentType(file));

    if (invalidFiles.length > 0) {
      setError("Only PDF files are allowed for documents");
      return;
    }

    const newDocuments: DocumentFile[] = fileArray.map((file) => ({
      file,
      document_type: "CPU",
    }));

    setValue("documents", [...documents, ...newDocuments]);
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setValue("documents", updatedDocuments);
  };

  // Function to get document name for display
  const getDocumentName = (doc: DocumentFile): string => {
    if (doc.file instanceof File) {
      return doc.file.name;
    }

    // For server-side documents, extract filename from URL
    if (doc.document && typeof doc.document === "string") {
      const urlParts = doc.document.split("/");
      return urlParts[urlParts.length - 1] || `Document (${doc.document_type})`;
    }

    if (doc.file_url && typeof doc.file_url === "string") {
      const urlParts = doc.file_url.split("/");
      return urlParts[urlParts.length - 1] || `Document (${doc.document_type})`;
    }

    return `Document (${doc.document_type})`;
  };

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-2xl font-bold'>Documents</h2>
        <p className='text-gray-600'>
          To estimate the value of your property, we will need the Urban
          Property Register (CPU). This document can be obtained, free of
          charge, through the Tax Portal.
        </p>
        <p className='text-gray-600 mt-4'>
          You may choose not to upload the document now and submit it later. We
          will be here to remind you if you do not do so now.
        </p>
      </div>

      <div>
        <Label className='mb-3 block'>
          Please upload the following documents
        </Label>

        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
            <FileUp className='h-10 w-10 text-gray-400' />
            <div className='text-gray-600'>
              <p className='font-medium'>Documents files only</p>
              <p>Click here to select documents</p>
            </div>
            <input
              id='document-upload'
              type='file'
              multiple
              className='hidden'
              onChange={handleChange}
              accept='.pdf,.doc,.docx,.txt'
            />
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                document.getElementById("document-upload")?.click()
              }
            >
              Select Files
            </Button>
          </div>
        </div>

        {documents.length > 0 && (
          <div className='mt-6 space-y-3'>
            <Label>Uploaded Documents</Label>
            {documents.map((doc, index) => (
              <Card key={index}>
                <CardContent className='p-4 flex justify-between items-center'>
                  <div className='flex items-center space-x-3'>
                    <FileText className='h-5 w-5' />
                    <span>{getDocumentName(doc)}</span>
                  </div>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => removeDocument(index)}
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </CardContent>
              </Card>
            ))}
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
