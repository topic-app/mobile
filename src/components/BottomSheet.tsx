import { useDimensions } from '@react-native-community/hooks';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

import { logger } from '@utils/index';

export type BottomSheetRef = ReanimatedBottomSheet;

// Get prop types of ReanimatedBottomSheet, remove the snapPoints prop
// and make all other props optional
type ReanimatedBottomSheetProps = Partial<
  Omit<React.ComponentProps<typeof ReanimatedBottomSheet>, 'snapPoints'>
>;

type BottomSheetProps = ReanimatedBottomSheetProps & {
  /**
   * Array of snap points to display in portrait mode,
   * which can either be a number or a percentage.
   * e.g. [40, '55%']
   */
  portraitSnapPoints: (string | number)[];
  /**
   * Array of snap points to display in landscape mode,
   * which can either be a number or a percentage.
   * e.g. [40, '55%']
   */
  landscapeSnapPoints: (string | number)[];
  /**
   * Whether to use top and bottom insets or not.
   */
  useInsets?: boolean;
};

const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      portraitSnapPoints: portraitSP,
      landscapeSnapPoints: landscapeSP,
      renderContent,
      useInsets,
      ...rest
    },
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
    const insets = useSafeAreaInsets();

    const snapPoints = (height > width ? portraitSP : landscapeSP).map((snapPoint) => {
      if (typeof snapPoint === 'string') {
        let SP = parseFloat(snapPoint) * 0.01 * height;
        if (useInsets) {
          SP += insets.top;
        }
        return SP;
      }
      return snapPoint;
    });

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
