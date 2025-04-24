"use client";

import * as React from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  url: string;
  fallbackHeight?: string;
  onError?: () => void;
}

export function PdfViewer({
  url,
  fallbackHeight = "500px",
  onError,
}: PdfViewerProps) {
  const [error, setError] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const handleError = () => {
    setError(true);
    if (onError) onError();
  };

  React.useEffect(() => {
    // Reset error state when URL changes
    setError(false);

    // Check if the iframe is accessible after it loads
    const checkIframeAccess = () => {
      if (!iframeRef.current) return;

      try {
        // This will throw an error if blocked by CORS
        const iframeDoc = iframeRef.current.contentDocument;
        // If we can't access the document or it's empty, consider it an error
        if (!iframeDoc || iframeDoc.body.innerHTML === "") {
          handleError();
        }
      } catch (error) {
        handleError();
        console.log(error);
      }
    };

    // Add load event listener to iframe
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", checkIframeAccess);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", checkIframeAccess);
      }
    };
  }, [url]);

  const handleDownload = () => {
    window.open(url, "_blank");
  };

  if (error) {
    return (
      <div
        className='flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8 bg-muted/10'
        style={{ height: fallbackHeight }}
      >
        <FileText className='h-16 w-16 text-muted-foreground' />
        <div className='text-center'>
          <h3 className='text-lg font-medium'>PDF Viewer Blocked</h3>
          <p className='text-sm text-muted-foreground max-w-md mx-auto'>
            Your browser has blocked this PDF from loading due to security
            restrictions. This commonly happens with cross-origin PDFs or due to
            Content Security Policy settings.
          </p>
          <div className='mt-4 flex flex-col gap-2'>
            <Button variant='default' onClick={handleDownload}>
              <Download className='mr-2 h-4 w-4' />
              Download PDF
            </Button>
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-primary hover:underline'
            >
              Open in new tab
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={`${url}#toolbar=0`}
      className='w-full h-full border-0'
      style={{ height: fallbackHeight }}
      onError={handleError}
      title='PDF Document'
    />
  );
}
