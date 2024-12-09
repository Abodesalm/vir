import ReactCrop, { Crop } from "react-image-crop";
import { getImageTransform } from "../../utils/imageScaling";

interface ImageContainerProps {
  imageUrl: string;
  imageRef: React.RefObject<HTMLImageElement>;
  isCropping: boolean;
  rotation: number;
  crop?: Crop;
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError: () => void;
  onCropChange?: (crop: Crop) => void;
  onCropComplete?: (crop: Crop) => void;
}

export function ImageContainer({
  imageUrl,
  imageRef,
  isCropping,
  rotation,
  crop,
  onImageLoad,
  onError,
  onCropChange,
  onCropComplete,
}: ImageContainerProps) {
  const imageStyle = getImageTransform(rotation);

  if (isCropping) {
    return (
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => onCropChange?.(percentCrop)}
        onComplete={(c) => {
          if (c.width && c.height) {
            onCropComplete?.(c);
          }
        }}
        keepSelection
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Document to categorize"
          style={imageStyle}
          onError={onError}
          onLoad={onImageLoad}
          loading="eager"
          crossOrigin="anonymous"
          className="max-w-none"
        />
      </ReactCrop>
    );
  }

  return (
    <img
      ref={imageRef}
      src={imageUrl}
      alt="Document to categorize"
      style={imageStyle}
      onError={onError}
      onLoad={onImageLoad}
      loading="eager"
      crossOrigin="anonymous"
      className="max-w-none"
    />
  );
}
