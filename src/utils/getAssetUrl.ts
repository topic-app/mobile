import { config } from '@root/app.json';

const { defaultSize, url: imageUrl } = config?.cdn?.image || {};

function getImageSize(thumbnails, size) {
  let imgSize = null;
  switch (size) {
    case 'large':
      if (thumbnails.large) {
        imgSize = 'large';
      } else if (thumbnails.medium) {
        imgSize = 'medium';
      } else {
        imgSize = 'small';
      }
      break;
    case 'medium':
      if (thumbnails.medium) {
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

function getImageUrl(image, size) {
  const imageSize = getImageSize(image.thumbnails, size);
  if (!imageUrl) {
    console.warn('Warning: Please specify config.cdn.imageUrl in app.json');
    return null;
  }
  if (image.image) {
    return `${imageUrl}${image.image}?size=${imageSize}`;
  }
  if (typeof image === 'string') {
    return `${imageUrl}${image}?size=${imageSize}`;
  }
  // console.log(`Warning: Invalid image object. Could not find image.image or a string`, image);
  return null;
}

// Could add getAudioUrl in the future here

// eslint-disable-next-line import/prefer-default-export
export { getImageUrl };
