import React from "react";
import { DocumentType } from "../../types";

interface DocumentTypeListProps {
  documentTypes: DocumentType[];
  selectedType: string;
  onSelect: (typeId: string) => void;
}

export function DocumentTypeList({
  documentTypes,
  selectedType,
  onSelect,
}: DocumentTypeListProps) {
  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {documentTypes.map((type, index) => (
        <button
          key={type.documenttype_id}
          onClick={() => onSelect(type.documenttype_id.toString())}
          className={`w-full text-left px-4 py-2 rounded transition-colors ${
            selectedType === type.documenttype_id.toString()
              ? "bg-blue-50 text-blue-700"
              : "hover:bg-gray-100"
          }`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}
