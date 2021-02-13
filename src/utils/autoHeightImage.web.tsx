import React from 'react';

// eslint-disable-next-line jsx-a11y/alt-text
const Image = ({ source, width, height, alt }: any) => (
  <img src={source.uri} alt={alt} style={{ maxWidth: width, maxHeight: height }} />
);

export default Image;
