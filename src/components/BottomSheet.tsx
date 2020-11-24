import { useDimensions } from '@react-native-community/hooks';
import React, { useState } from 'react';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { logger } from '@utils/index';

export type BottomSheetRef = ReanimatedBottomSheet;

type SnapPointsArray = (number | string)[];

// Get prop types of ReanimatedBottomSheet, remove the snapPoints prop
// and make all other props optional
type ReanimatedBottomSheetProps = Partial<
  Omit<React.ComponentProps<typeof ReanimatedBottomSheet>, 'snapPoints'>
>;

type BottomSheetProps = ReanimatedBottomSheetProps & {
  /**
   * Array of numbers between 0 and 1 indicating where the
   * bottom modal should snap to, should be of same length
   * as landscapeSnapPoints.
   */
  portraitSnapPoints: number[];
  /**
   * Array of numbers between 0 and 1 indicating where the
   * bottom modal should snap to, should be of same length
   * as landscapeSnapPoints.
   */
  landscapeSnapPoints: number[];
};

const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    { portraitSnapPoints: portraitSP, landscapeSnapPoints: landscapeSP, renderContent, ...rest },
    ref,
  ) => {
    if (portraitSP.length === 0 || landscapeSP.length === 0) {
      logger.warn('BottomSheet: snap point array should not be empty');
    }
    if (portraitSP.length !== landscapeSP.length) {
      logger.warn(
        'BottomSheet: portraitSnapPoints should be of same length as landscapeSnapPoints',
      );
    }

    const { height, width } = useDimensions().window;
    const snapPoints = (height > width ? portraitSP : landscapeSP).map(
      (snapPoint) => snapPoint * height,
    );

    return (
      <ReanimatedBottomSheet
        ref={ref}
        snapPoints={snapPoints}
        renderContent={renderContent}
        enabledManualSnapping
        {...rest}
      />
    );
  },
);

export default BottomSheet;
