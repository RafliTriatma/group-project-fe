import { FC } from 'react';
import { StarIcon } from './icons';

interface ProductRatingProps {
  rating: number;
  reviewCount: number;
}

export const ProductRating: FC<ProductRatingProps> = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center mb-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} filled={star <= Math.round(rating)} />
        ))}
      </div>
      <span className="ml-2 text-sm">{rating} Star Rating ({reviewCount.toLocaleString()} User feedback)</span>
    </div>
  );
};