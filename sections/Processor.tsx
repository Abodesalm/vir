"use client";
import { useState, useEffect } from "react";
import { DocumentImage } from "@/components/processor/DocumentImage";
import { ProgressBar } from "@/components/processor/ProgressBar";
import { Document, DocumentType } from "../types";
import { fetchNextDocument, updateDocument } from "../services/document";
import { createSplitDocument } from "../services/api";
import { fetchDocumentTypes } from "../services/documentTypes";
import { getDocumentCount } from "../services/api";

export function Processor() {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);

  const loadNextDocument = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetchNextDocument();

    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setDocument(response.data);
    } else {
      setDocument(null);
      setError("No more documents to process");
    }

    setIsLoading(false);
  };

  const handleProcessDocument = async () => {
    if (!document) return;

    setIsLoading(true);
    const response = await updateDocument(document.document_id, "processed");

    if (response.error) {
      setError(response.error);
    } else {
      setProcessedCount((prev) => prev + 1);
      await loadNextDocument();
    }

    setIsLoading(false);
  };

  const handleRejectDocument = async () => {
    if (!document) return;

    setIsLoading(true);
    const response = await updateDocument(document.document_id, "rejected");

    if (response.error) {
      setError(response.error);
    } else {
      setProcessedCount((prev) => prev + 1);
      await loadNextDocument();
    }

    setIsLoading(false);
  };

  const handleSplitDocument = async (
    imageData: string,
    documentTypeId: string
  ) => {
    if (!document) return;

    setIsLoading(true);
    setError(null);

    const response = await createSplitDocument(
      document.document_id,
      imageData,
      documentTypeId
    );

    if (response.error) {
      setError(response.error);
    }

    setIsLoading(false);
  };

  const loadDocumentCount = async () => {
    const response = await getDocumentCount();
    if (response.data) {
      setTotalDocuments(response.data.count);
    }
  };

  useEffect(() => {
    const loadTypes = async () => {
      const types = await fetchDocumentTypes();
      setDocumentTypes(types);
    };

    loadTypes();
    loadNextDocument();
    loadDocumentCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {document && (
            <>
              <div className="lg:col-span-5">
                <DocumentImage
                  src={document.filepath}
                  documentId={document.document_id}
                  onRetry={loadNextDocument}
                  onSplitDocument={handleSplitDocument}
                  onProcessDocument={handleProcessDocument}
                  documentTypes={documentTypes}
                />
              </div>
              <div className="space-y-6">
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleProcessDocument}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                  <button
                    onClick={loadNextDocument}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleRejectDocument}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                          disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>
                <ProgressBar current={processedCount} total={totalDocuments} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
