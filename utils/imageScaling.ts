import { RefObject } from 'react';

interface ImageSize {
  width: number;
  height: number;
}

interface ContainerSize {
  width: number;
  height: number;
}

export function getImageTransform(rotation: number): React.CSSProperties {
  return {
    transform: `rotate(${rotation}deg)`,
    maxWidth: 'none',
    transition: 'transform 0.2s ease-out',
    transformOrigin: 'center center',
  };
}

export function updateContainerSize(
  containerRef: RefObject<HTMLDivElement>,
  setContainerSize: (size: ContainerSize) => void
) {
  if (containerRef.current) {
    const rect = containerRef.current.getBoundingClientRect();
    setContainerSize({
      width: rect.width,
      height: rect.height
    });
  }
}

export function calculateCropDimensions(
  imageRef: HTMLImageElement,
  imageSize: ImageSize,
  pixelCrop: { width: number; height: number; x: number; y: number }
) {
  const scaleX = imageSize.width / imageRef.width;
  const scaleY = imageSize.height / imageRef.height;
  
  return {
    width: Math.round(pixelCrop.width * scaleX),
    height: Math.round(pixelCrop.height * scaleY),
    x: Math.round(pixelCrop.x * scaleX),
    y: Math.round(pixelCrop.y * scaleY)
  };
}