import React from 'react';
import { Banner as PaperBanner } from 'react-native-paper';

type BannerProps = Omit<React.ComponentProps<typeof PaperBanner>, 'children'> & {
  children: React.ReactNode;
};

const Banner = PaperBanner as React.FC<BannerProps>;

export default Banner;
