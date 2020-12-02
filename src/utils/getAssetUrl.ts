import { Config } from '@constants/index';
import { Image } from '@ts/types';

import logger from './logger';

const imageUrl = Config.cdn.baseUrl;
const { defaultSize } = Config.cdn.image;

type ImageSize = 'small' | 'medium' | 'large' | 'full';

function getImageSize(thumbnails: Image['thumbnails'], size: ImageSize): string {
  let imgSize = null;
  switch (size) {
    case 'full':
      imgSize = 'full';
      break;
    case 'large':
      if (thumbnails?.large) {
        imgSize = 'large';
      } else if (thumbnails?.medium) {
        imgSize = 'medium';
      } else {
        imgSize = 'small';
      }
      break;
    case 'medium':
      if (thumbnails?.medium) {
        imgSize = 'medium';
      } else {
        imgSize = 'small';
      }
      break;
    case 'small':
      imgSize = 'small';
      break;
    default:
      imgSize = defaultSize;
      break;
  }
  return imgSize;
}

function getImageUrl({ image, size }: { image?: Image | string; size: ImageSize }) {
  if (!imageUrl) logger.warn('Warning: Please specify cdn.image.url in constants/config.ts');
  if (image) {
    if (typeof image === 'string') {
      return `${imageUrl}${image}?size=${size}`;
    }
    const imageSize = getImageSize(image.thumbnails, size);
    if (image.image) {
      return `${imageUrl}${image.image}?size=${imageSize}`;
    }
  }
}

// Could add getAudioUrl in the future here

export { getImageUrl };
