/* eslint-disable @next/next/no-img-element */
import React from "react";
import { X } from "lucide-react";

interface CroppedImageProps {
  src: string;
  onRemove: () => void;
}

export function CroppedImage({ src, onRemove }: CroppedImageProps) {
  return (
    <div className="relative group">
      <img
        src={src}
        alt="Cropped document section"
        className="w-full h-32 object-cover rounded-lg"
      />
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 
                group-hover:opacity-100 transition-opacity"
        title="Remove"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
