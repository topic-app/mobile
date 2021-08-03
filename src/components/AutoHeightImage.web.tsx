import React from 'react';

const Image = ({ source, height, width, alt, maxHeight }: any) => (
  <img
    src={source.uri}
    alt={alt}
    style={{ maxWidth: width || 800, maxHeight, objectFit: 'cover' }}
  />
);

export default Image;
