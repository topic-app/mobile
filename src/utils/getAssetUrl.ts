import { config } from '@root/app.json';
import { Image } from '@ts/types';

import logger from './logger';

const imageUrl = config.cdn?.image.url;
const defaultSize = config.cdn?.image.defaultSize;

type ImageSize = 'small' | 'medium' | 'large' | 'full';

function getImageSize(thumbnails: Image['thumbnails'], size: ImageSize): string {
  let imgSize = null;
  switch (size) {
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

function getImageUrl({ image, size }: { image?: Image; size: ImageSize }) {
  if (!imageUrl) logger.warn('Warning: Please specify config.cdn.image.url in app.json');
  if (image) {
    const imageSize = getImageSize(image.thumbnails, size);
    if (image.image) {
      return `${imageUrl}${image.image}?size=${imageSize}`;
    }
    if (typeof image === 'string') {
      return `${imageUrl}${image}?size=${imageSize}`;
    }
  }
}

// Could add getAudioUrl in the future here

// eslint-disable-next-line import/prefer-default-export
export { getImageUrl };
