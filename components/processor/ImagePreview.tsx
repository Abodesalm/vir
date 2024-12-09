interface ImagePreviewProps {
  src: string;
  dimensions: { width: number; height: number } | null;
}

export function ImagePreview({ src, dimensions }: ImagePreviewProps) {
  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Cropped Image Preview
          </h3>
          {dimensions && (
            <span className="text-sm text-gray-500">
              {dimensions.width}px × {dimensions.height}px
            </span>
          )}
        </div>
        <div className="flex justify-center">
          <img
            src={src}
            alt="Cropped preview"
            className="max-h-48 object-contain rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
