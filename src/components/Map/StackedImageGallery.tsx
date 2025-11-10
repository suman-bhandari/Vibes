import React, { useState } from 'react';
import { VenueImage } from '../../types';

interface StackedImageGalleryProps {
  images: VenueImage[];
  onImageClick?: (image: VenueImage) => void;
}

const StackedImageGallery: React.FC<StackedImageGalleryProps> = ({ images, onImageClick }) => {
  const [expandedImage, setExpandedImage] = useState<VenueImage | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  // Sort images by uploadedAt (newest first)
  const sortedImages = [...images].sort(
    (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
  );

  // Show all images (they're scrollable now)
  const displayImages = sortedImages;

  const handleImageClick = (image: VenueImage) => {
    if (onImageClick) {
      onImageClick(image);
    } else {
      setExpandedImage(image);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <h3 className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Recent Photos
        </h3>
        <div className="flex-1 overflow-x-auto overflow-y-hidden hide-scrollbar">
          <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
            {displayImages.map((image, index) => {
              return (
                <button
                  key={image.id}
                  onClick={() => handleImageClick(image)}
                  className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2 border-white dark:border-gray-800 relative"
                  style={{
                    width: '100px',
                    height: '100px',
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge for newest image */}
                  {index === 0 && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-semibold">
                      NEW
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[200] flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            onClick={() => setExpandedImage(null)}
          >
            ×
          </button>
          <img
            src={expandedImage.url}
            alt={expandedImage.caption || 'Expanded image'}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          {expandedImage.caption && (
            <div className="mt-4 text-center text-white">
              <p className="text-sm">{expandedImage.caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default StackedImageGallery;

