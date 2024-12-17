"use client";
import { useState, useRef, useEffect } from "react";
import { ImageOff, RotateCw, Scissors, ZoomIn, ZoomOut } from "lucide-react";
import { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { CroppedImage } from "./CroppedImage";
import { DocumentTypeDialog } from "./DocumentTypeDialog";
import { ImageContainer } from "./ImageContainer";
import { DocumentType } from "../../types";
import { rotateDocument, resizeDocument } from "../../services/api";
import { getStorageUrl } from "../../utils/imageUrl";
import {
  updateContainerSize,
  calculateCropDimensions,
} from "../../utils/imageScaling";
import { useTranslations } from "next-intl";

interface DocumentImageProps {
  src: string;
  documentId: number;
  onRetry: () => void;
  onSplitDocument?: (croppedImage: string, documentTypeId: string) => void;
  onProcessDocument?: () => Promise<void>;
  documentTypes: DocumentType[];
}

export function DocumentImage({
  src,
  documentId,
  onRetry,
  onSplitDocument,
  onProcessDocument,
  documentTypes,
}: DocumentImageProps) {
  const [error, setError] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrops, setCompletedCrops] = useState<string[]>([]);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [pixelCrop, setPixelCrop] = useState<PixelCrop | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const MAX_RETRIES = 3;

  const imageUrl = getStorageUrl(src);

  const t = useTranslations("processor");

  useEffect(() => {
    let mounted = true;

    const loadImage = async () => {
      if (retryCount >= MAX_RETRIES) {
        setError(true);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(false);
        const response = await fetch(imageUrl, {
          credentials: "include",
        });

        if (!response.ok) throw new Error(t("failed_image"));

        if (mounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error(`${t("failed_image")}:`, err);
        if (mounted) {
          setRetryCount((prev) => prev + 1);
          setError(true);
          setIsLoading(false);
        }
      }
    };

    loadImage();
    return () => {
      mounted = false;
    };
  }, [imageUrl, retryCount]);

  useEffect(() => {
    const handleResize = () =>
      updateContainerSize(containerRef, setContainerSize);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleError = () => {
    setError(true);
    setRetryCount((prev) => prev + 1);
  };

  const rotate = async () => {
    try {
      const response = await rotateDocument(documentId);
      if (response.error) {
        throw new Error(response.error);
      }
      setRotation((prev) => (prev + 90) % 360);
    } catch (err) {
      console.error(`${t("failed_rotate")}:`, err);
    }
  };

  const handleResize = async (scale: number) => {
    if (isResizing) return;

    try {
      setIsResizing(true);
      const response = await resizeDocument(documentId, scale);
      if (response.error) {
        throw new Error(response.error);
      }
      // Reload the image by updating the URL with a timestamp
      const timestamp = new Date().getTime();
      const newUrl = `${imageUrl}?t=${timestamp}`;
      if (imageRef.current) {
        imageRef.current.src = newUrl;
      }
    } catch (err) {
      console.error(`${"failed_resize"}:`, err);
    } finally {
      setIsResizing(false);
    }
  };

  const toggleCropping = () => {
    setIsCropping(!isCropping);
    setCrop(undefined);
    setPixelCrop(null);
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageLoaded(true);
    setImageSize({
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
  };

  const cropImage = async () => {
    if (!imageRef.current || !pixelCrop || !imageSize) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dimensions = calculateCropDimensions(
      imageRef.current,
      imageSize,
      pixelCrop
    );

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const rotationCanvas = document.createElement("canvas");
    const rotationCtx = rotationCanvas.getContext("2d");
    if (!rotationCtx) return;

    rotationCanvas.width = imageSize.width;
    rotationCanvas.height = imageSize.height;

    rotationCtx.save();
    if (rotation !== 0) {
      rotationCtx.translate(
        rotationCanvas.width / 2,
        rotationCanvas.height / 2
      );
      rotationCtx.rotate((rotation * Math.PI) / 180);
      rotationCtx.translate(
        -rotationCanvas.width / 2,
        -rotationCanvas.height / 2
      );
    }

    rotationCtx.drawImage(
      imageRef.current,
      0,
      0,
      imageSize.width,
      imageSize.height
    );

    rotationCtx.restore();

    ctx.drawImage(
      rotationCanvas,
      dimensions.x,
      dimensions.y,
      dimensions.width,
      dimensions.height,
      0,
      0,
      dimensions.width,
      dimensions.height
    );

    const base64Image = canvas.toDataURL("image/jpeg", 1.0);
    setCurrentCropImage(base64Image);
    setIsTypeDialogOpen(true);
    setCrop(undefined);
    setPixelCrop(null);
    setIsCropping(false);
  };

  const handleTypeSelect = async (
    documentTypeId: string,
    shouldProceedNext: boolean = false
  ) => {
    if (currentCropImage && onSplitDocument) {
      await onSplitDocument(currentCropImage, documentTypeId);
      setCompletedCrops((prev) => [...prev, currentCropImage]);

      if (shouldProceedNext && onProcessDocument) {
        await onProcessDocument();
      }
    }
    setCurrentCropImage(null);
    setIsTypeDialogOpen(false);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-light dark:bg-darker rounded-lg">
        <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4 first-letter:uppercase">
          {t("failed_image")}
        </p>
        {retryCount < MAX_RETRIES && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry ({MAX_RETRIES - retryCount} attempts remaining)
          </button>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600">Loading image...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={rotate}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleCropping}
            className={`p-2 rounded-lg transition-colors ${
              isCropping ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
            }`}
            title="Split Document"
          >
            <Scissors className="w-5 h-5" />
          </button>
          <div className="border-l border-gray-200 mx-2" />
          <button
            onClick={() => handleResize(0.9)} // 90% of current size (10% smaller)
            disabled={isResizing}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Reduce size by 10%"
          >
            <ZoomOut className="w-5 h-5" />
            <span className="text-xs ml-1">10%</span>
          </button>
          <button
            onClick={() => handleResize(0.75)} // 75% of current size (25% smaller)
            disabled={isResizing}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            title="Reduce size by 25%"
          >
            <ZoomOut className="w-5 h-5" />
            <span className="text-xs ml-1">25%</span>
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative h-[calc(100vh-12rem)] bg-gray-50 rounded-lg overflow-auto"
      >
        <div
          className={`h-full flex items-center justify-center p-6 ${
            imageLoaded ? "" : "animate-pulse"
          }`}
        >
          <ImageContainer
            imageUrl={imageUrl}
            imageRef={imageRef}
            isCropping={isCropping}
            rotation={rotation}
            crop={crop}
            onImageLoad={handleImageLoad}
            onError={handleError}
            onCropChange={(newCrop) => {
              setCrop(newCrop);
              setPixelCrop(newCrop as PixelCrop);
            }}
            onCropComplete={cropImage}
          />
        </div>
      </div>

      {completedCrops.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Split Documents
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {completedCrops.map((cropUrl, index) => (
              <CroppedImage
                key={index}
                src={cropUrl}
                onRemove={() => {
                  setCompletedCrops((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}

      <DocumentTypeDialog
        isOpen={isTypeDialogOpen}
        onClose={() => setIsTypeDialogOpen(false)}
        onSelect={handleTypeSelect}
        documentTypes={documentTypes}
        cropPreview={currentCropImage}
      />
    </div>
  );
}
