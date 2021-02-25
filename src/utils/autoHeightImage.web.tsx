import React from 'react';

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ source, height, width, alt, maxHeight }: any) => (
  <img src={source.uri} alt={alt} style={{ maxWidth: width, maxHeight, objectFit: 'cover' }} />
);

export default Image;
