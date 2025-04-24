"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  File,
  FileText,
  X,
  FileSpreadsheet,
  FileImage,
  FileAudio,
  FileVideo,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DocumentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Array<{
    id?: number;
    document?: string;
    file_url?: string;
    file?: string;
    url?: string;
    document_type?: string;
    uploaded_at?: string;
    name?: string;
    mime_type?: string;
  }>;
  initialIndex?: number;
}

export function DocumentDialog({
  isOpen,
  onClose,
  documents,
  initialIndex = 0,
}: DocumentDialogProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [downloadStatus, setDownloadStatus] = React.useState<
    "idle" | "downloading" | "success" | "error"
  >("idle");
  const [downloadError, setDownloadError] = React.useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = React.useState(0);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
    setDownloadStatus("idle");
    setDownloadError(null);
    setDownloadProgress(0);
  }, [initialIndex, isOpen]);

  const currentDocument = documents[currentIndex];
  const documentUrl =
    currentDocument?.document ||
    currentDocument?.file_url ||
    currentDocument?.file ||
    currentDocument?.url ||
    "";
  const documentType = currentDocument?.document_type || "Document";
  const mimeType = currentDocument?.mime_type || "";

  // Extract filename from URL while preserving the extension
  const getFilenameFromUrl = (url: string) => {
    // Handle invalid URLs
    if (!url || url.startsWith("file:///")) {
      return `document-${currentIndex + 1}`;
    }

    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const urlParts = pathname.split("/");
      let filename = urlParts[urlParts.length - 1];

      // Decode URI components
      try {
        filename = decodeURIComponent(filename);
      } catch (e) {
        console.log(e);
      }

      return filename || `document-${currentIndex + 1}`;
    } catch (e) {
      console.log(e);

      // If URL parsing fails, try a simple split
      const urlParts = url.split("/");
      let filename = urlParts[urlParts.length - 1];

      // Remove query parameters if present
      if (filename.includes("?")) {
        filename = filename.split("?")[0];
      }

      // Remove hash if present
      if (filename.includes("#")) {
        filename = filename.split("#")[0];
      }

      return filename || `document-${currentIndex + 1}`;
    }
  };

  // Use provided name or extract from URL
  const documentName = currentDocument?.name || getFilenameFromUrl(documentUrl);

  const uploadDate = currentDocument?.uploaded_at
    ? new Date(currentDocument.uploaded_at).toLocaleDateString()
    : "Unknown date";

  const handlePrevious = () => {
    setDownloadStatus("idle");
    setDownloadError(null);
    setDownloadProgress(0);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : documents.length - 1));
  };

  const handleNext = () => {
    setDownloadStatus("idle");
    setDownloadError(null);
    setDownloadProgress(0);
    setCurrentIndex((prev) => (prev < documents.length - 1 ? prev + 1 : 0));
  };

  // Get file icon based on extension or mime type
  const getFileIcon = () => {
    const extension = documentName.split(".").pop()?.toLowerCase() || "";
    const mimeTypeLower = mimeType.toLowerCase();

    // Check mime type first
    if (
      mimeTypeLower.includes("spreadsheet") ||
      mimeTypeLower.includes("excel") ||
      mimeTypeLower.includes("csv") ||
      extension === "xlsx" ||
      extension === "xls" ||
      extension === "csv"
    ) {
      return <FileSpreadsheet className='h-16 w-16 text-green-500' />;
    }

    if (
      mimeTypeLower.includes("image") ||
      ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)
    ) {
      return <FileImage className='h-16 w-16 text-blue-500' />;
    }

    if (
      mimeTypeLower.includes("audio") ||
      ["mp3", "wav", "ogg", "m4a"].includes(extension)
    ) {
      return <FileAudio className='h-16 w-16 text-purple-500' />;
    }

    if (
      mimeTypeLower.includes("video") ||
      ["mp4", "webm", "avi", "mov"].includes(extension)
    ) {
      return <FileVideo className='h-16 w-16 text-red-500' />;
    }

    if (mimeTypeLower.includes("pdf") || extension === "pdf") {
      return <FileText className='h-16 w-16 text-orange-500' />;
    }

    if (
      ["doc", "docx", "txt", "rtf"].includes(extension) ||
      mimeTypeLower.includes("word") ||
      mimeTypeLower.includes("text")
    ) {
      return <FileText className='h-16 w-16 text-blue-500' />;
    }

    // Default icon
    return <File className='h-16 w-16 text-muted-foreground' />;
  };

  // Function to fix local file URLs
  const getFixedUrl = (url: string) => {
    // If it's a file:/// URL, we can't use it directly
    if (url.startsWith("file:///")) {
      // Check if we have a server URL for the same file
      if (
        currentDocument?.document &&
        !currentDocument.document.startsWith("file:///")
      ) {
        return currentDocument.document;
      }
      if (
        currentDocument?.file_url &&
        !currentDocument.file_url.startsWith("file:///")
      ) {
        return currentDocument.file_url;
      }
      if (
        currentDocument?.file &&
        !currentDocument.file.startsWith("file:///")
      ) {
        return currentDocument.file;
      }
      if (currentDocument?.url && !currentDocument.url.startsWith("file:///")) {
        return currentDocument.url;
      }

      // If we don't have a server URL, we can't download this file
      throw new Error("Cannot download local files. Please use a server URL.");
    }

    return url;
  };

  const handleDownload = async () => {
    if (!documentUrl) {
      setDownloadError("No document URL available");
      setDownloadStatus("error");
      return;
    }

    try {
      // Try to fix the URL if it's a local file
      const fixedUrl = getFixedUrl(documentUrl);

      setDownloadStatus("downloading");
      setDownloadError(null);
      setDownloadProgress(0);

      // Method 1: Using fetch with XMLHttpRequest for progress tracking
      try {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", fixedUrl, true);
        xhr.responseType = "blob";

        // Track download progress
        xhr.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setDownloadProgress(progress);
          }
        };

        xhr.onload = function () {
          if (this.status === 200) {
            // Get content type from response or use a default based on file extension
            let contentType = xhr.getResponseHeader("content-type") || "";

            if (!contentType || contentType === "application/octet-stream") {
              // Try to determine content type from file extension
              const extension = documentName.split(".").pop()?.toLowerCase();
              if (extension) {
                switch (extension) {
                  case "pdf":
                    contentType = "application/pdf";
                    break;
                  case "doc":
                  case "docx":
                    contentType = "application/msword";
                    break;
                  case "xls":
                  case "xlsx":
                    contentType = "application/vnd.ms-excel";
                    break;
                  case "ppt":
                  case "pptx":
                    contentType = "application/vnd.ms-powerpoint";
                    break;
                  case "jpg":
                  case "jpeg":
                    contentType = "image/jpeg";
                    break;
                  case "png":
                    contentType = "image/png";
                    break;
                  case "gif":
                    contentType = "image/gif";
                    break;
                  case "txt":
                    contentType = "text/plain";
                    break;
                  case "csv":
                    contentType = "text/csv";
                    break;
                  // Add more types as needed
                }
              }

              // If we still don't have a content type, use octet-stream as fallback
              if (!contentType) {
                contentType = "application/octet-stream";
              }
            }

            // Create blob with the correct content type
            const blob = new Blob([xhr.response], { type: contentType });
            const blobUrl = URL.createObjectURL(blob);

            // Create a download link
            const link = document.createElement("a");
            link.href = blobUrl;

            // Ensure filename has the correct extension
            let filename = documentName;
            const fileExtension = filename.split(".").pop()?.toLowerCase();

            // If filename doesn't have an extension, try to add one based on content type
            if (!fileExtension) {
              if (contentType.includes("pdf")) filename += ".pdf";
              else if (contentType.includes("msword")) filename += ".docx";
              else if (contentType.includes("excel")) filename += ".xlsx";
              else if (contentType.includes("powerpoint")) filename += ".pptx";
              else if (contentType.includes("jpeg")) filename += ".jpg";
              else if (contentType.includes("png")) filename += ".png";
              // Add more mappings as needed
            }

            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL after a short delay
            setTimeout(() => {
              URL.revokeObjectURL(blobUrl);
            }, 100);

            setDownloadStatus("success");
            setDownloadProgress(100);
          } else {
            throw new Error(`HTTP error! status: ${this.status}`);
          }
        };

        xhr.onerror = () => {
          throw new Error("Network error occurred");
        };

        xhr.send();
      } catch (xhrError) {
        console.log("XHR method failed, trying fetch", xhrError);

        // Method 2: Using fetch as fallback
        try {
          const response = await fetch(fixedUrl);
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const blob = await response.blob();

          // Get content type from response
          const contentType =
            response.headers.get("content-type") ||
            blob.type ||
            "application/octet-stream";

          // Create blob with the correct content type
          const blobWithType = new Blob([blob], { type: contentType });
          const blobUrl = URL.createObjectURL(blobWithType);

          // Create a download link
          const link = document.createElement("a");
          link.href = blobUrl;

          // Get filename from Content-Disposition header if available
          const contentDisposition = response.headers.get(
            "content-disposition"
          );
          let filename = documentName;

          if (contentDisposition) {
            const filenameMatch =
              contentDisposition.match(/filename="(.+)"/) ||
              contentDisposition.match(/filename=([^;]+)/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1].trim();
            }
          }

          // Ensure filename has the correct extension
          const fileExtension = filename.split(".").pop()?.toLowerCase();

          // If filename doesn't have an extension, try to add one based on content type
          if (!fileExtension) {
            if (contentType.includes("pdf")) filename += ".pdf";
            else if (contentType.includes("msword")) filename += ".docx";
            else if (contentType.includes("excel")) filename += ".xlsx";
            else if (contentType.includes("powerpoint")) filename += ".pptx";
            else if (contentType.includes("jpeg")) filename += ".jpg";
            else if (contentType.includes("png")) filename += ".png";
            // Add more mappings as needed
          }

          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the blob URL after a short delay
          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 100);

          setDownloadStatus("success");
          setDownloadProgress(100);
        } catch (fetchError) {
          console.log(
            "Fetch method failed, trying direct download",
            fetchError
          );

          // Method 3: Direct download as last resort
          try {
            const link = document.createElement("a");
            link.href = fixedUrl;
            link.setAttribute("download", documentName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadStatus("success");
            setDownloadProgress(100);
          } catch (directError) {
            throw new Error("All download methods failed");
            console.log(directError);
          }
        }
      }
    } catch (error) {
      console.error("Download error:", error);
      setDownloadStatus("error");
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Failed to download document. Please try again."
      );
      setDownloadProgress(0);
    }
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

  if (!documents.length) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-sm'>
        <div className='relative flex flex-col'>
          <div className='absolute top-2 right-2 z-10 flex gap-2'>
            <Button
              variant='default'
              onClick={handleDownload}
              disabled={downloadStatus === "downloading"}
              className='rounded-md bg-primary hover:bg-primary/90'
            >
              <Download className='h-5 w-5 mr-2' />
              {downloadStatus === "downloading"
                ? `Downloading... ${downloadProgress}%`
                : "Download Document"}
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

          <div className='relative min-h-[400px] w-full overflow-hidden p-4 mt-12'>
            <div className='flex h-[400px] w-full flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8'>
              {getFileIcon()}
              <div className='text-center'>
                <h3 className='text-lg font-medium'>{documentType}</h3>
                <p className='text-sm text-muted-foreground'>
                  Uploaded on {uploadDate}
                </p>
                <div className='mt-4 flex flex-col gap-2'>
                  <Button
                    variant='default'
                    onClick={handleDownload}
                    disabled={downloadStatus === "downloading"}
                    className='w-full'
                  >
                    <Download className='mr-2 h-4 w-4' />
                    {downloadStatus === "downloading"
                      ? "Downloading..."
                      : "Download Document"}
                  </Button>

                  {downloadStatus === "downloading" && (
                    <div className='w-full bg-muted rounded-full h-2.5 mt-2'>
                      <div
                        className='bg-primary h-2.5 rounded-full'
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                      <p className='text-xs text-muted-foreground text-right mt-1'>
                        {downloadProgress}%
                      </p>
                    </div>
                  )}

                  {downloadStatus === "success" && (
                    <p className='text-sm text-green-500 mt-2'>
                      Download successful! Check your downloads folder.
                    </p>
                  )}

                  {downloadStatus === "error" && downloadError && (
                    <p className='text-sm text-red-500 mt-2'>{downloadError}</p>
                  )}

                  {documentUrl && (
                    <div className='mt-4 text-xs text-muted-foreground break-all'>
                      <p>Document name: {documentName}</p>
                      {documentUrl.startsWith("file:///") && (
                        <p className='text-amber-500 mt-1'>
                          Warning: This is a local file URL which cannot be
                          accessed directly. Please use a server URL instead.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant='ghost'
              size='icon'
              className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background'
              onClick={handlePrevious}
            >
              <ChevronLeft className='h-6 w-6' />
              <span className='sr-only'>Previous document</span>
            </Button>

            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 hover:bg-background'
              onClick={handleNext}
            >
              <ChevronRight className='h-6 w-6' />
              <span className='sr-only'>Next document</span>
            </Button>
          </div>

          <div className='p-4 border-t'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-muted-foreground'>
                Document {currentIndex + 1} of {documents.length}
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleDownload}
                  disabled={downloadStatus === "downloading"}
                >
                  <Download className='h-4 w-4 mr-2' />
                  Download
                </Button>
              </div>
            </div>

            <div className='mt-4 flex gap-2 overflow-x-auto pb-2'>
              {documents.map((doc, idx) => (
                <>
                  {console.log(doc)}
                  <button
                    key={idx}
                    className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                      idx === currentIndex
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setDownloadStatus("idle");
                      setDownloadError(null);
                      setDownloadProgress(0);
                      setCurrentIndex(idx);
                    }}
                  >
                    <div className='flex h-full w-full items-center justify-center bg-muted'>
                      <File className='h-8 w-8 text-muted-foreground' />
                    </div>
                  </button>
                </>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
