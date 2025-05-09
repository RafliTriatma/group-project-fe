import { FC } from 'react';
import { ShareIcon, FacebookIcon, TwitterIcon, MoreIcon } from './icons';


export const SocialShare: FC = () => {
  return (
    <div className="flex items-center text-gray-600">
      <span className="mr-2">Share product:</span>
      <button className="ml-2" aria-label="Share">
        <ShareIcon />
      </button>
      <button className="ml-2" aria-label="Share on Facebook">
        <FacebookIcon />
      </button>
      <button className="ml-2" aria-label="Share on Twitter">
        <TwitterIcon />
      </button>
      <button className="ml-2" aria-label="More sharing options">
        <MoreIcon />
      </button>
    </div>
  );
};