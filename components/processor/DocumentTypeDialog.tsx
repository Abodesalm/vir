"use client";
import { useEffect, useState } from "react";
import { DocumentType } from "../../types";
import { DocumentTypeList } from "./DocumentTypeList";
import { ImagePreview } from "./ImagePreview";

interface DocumentTypeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (typeId: string, shouldProceedNext?: boolean) => void;
  documentTypes: DocumentType[];
  cropPreview?: string | null;
}

export function DocumentTypeDialog({
  isOpen,
  onClose,
  onSelect,
  documentTypes,
  cropPreview,
}: DocumentTypeDialogProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (cropPreview) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = cropPreview;
    }
  }, [cropPreview]);

  const handleKeyPress = (e: KeyboardEvent) => {
    const key = Number(e.key);
    if (key >= 1 && key <= documentTypes.length) {
      const selectedTypeId = documentTypes[key - 1].documenttype_id.toString();
      setSelectedType(selectedTypeId);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [documentTypes]);

  const handleSubmit = (shouldProceedNext: boolean = false) => {
    if (selectedType) {
      onSelect(selectedType, shouldProceedNext);
      setSelectedType("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold">Select Document Type</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        {cropPreview && (
          <ImagePreview src={cropPreview} dimensions={imageDimensions} />
        )}

        <DocumentTypeList
          documentTypes={documentTypes}
          selectedType={selectedType}
          onSelect={setSelectedType}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={!selectedType}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={!selectedType}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit & Next
          </button>
        </div>
      </div>
    </div>
  );
}
