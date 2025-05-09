import { FC } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface ProductGalleryProps {
  productName: string;
}

export const ProductGallery: FC<ProductGalleryProps> = ({ productName }) => {
  const thumbnails = [1, 2, 3, 4, 5];
  
  return (
    <div>
      <div className="border rounded-lg p-4 mb-4">
        <Image 
          src="/macbook-pro.jpg" 
          alt={productName} 
          width={500} 
          height={400}
          className="w-full object-contain"
          priority
        />
      </div>
      
      <div className="flex justify-between items-center">
        <button className="p-2 bg-gray-100 rounded-full">
          <ChevronLeftIcon />
        </button>
        
        <div className="flex gap-2 overflow-x-auto">
          {thumbnails.map((index) => (
            <div 
              key={index} 
              className={`border ${index === 1 ? 'border-blue-500' : 'border-gray-300'} rounded-lg w-16 h-16`}
            >
              <Image 
                src={`/macbook-${index}.jpg`} 
                alt={`${productName} thumbnail ${index}`} 
                width={64} 
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <button className="p-2 bg-gray-100 rounded-full">
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};