import React from 'react';
import { Dimensions, View } from 'react-native';
import ReanimatedBottomSheet from 'reanimated-bottom-sheet';

export type BottomSheetRef = ReanimatedBottomSheet;

type SnapPointsArray = (number | string)[];

// Get prop types of ReanimatedBottomSheet, remove the snapPoints prop
// and make all other props optional
type ReanimatedBottomSheetProps = Partial<
  Omit<React.ComponentProps<typeof ReanimatedBottomSheet>, 'snapPoints'>
>;

type BottomSheetProps = ReanimatedBottomSheetProps & {
  portraitSnapPoints: (number | string)[];
  landscapeSnapPoints: (number | string)[];
};

function checkPortraitOrientation() {
  const { height, width } = Dimensions.get('window');
  return height > width;
}

const BottomSheet = React.forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ portraitSnapPoints, landscapeSnapPoints, renderContent, ...rest }, ref) => {
    const isPortrait = checkPortraitOrientation();
    const [snapPoints, setSnapPoints] = React.useState(
      isPortrait ? portraitSnapPoints : landscapeSnapPoints,
    );

    if (portraitSnapPoints.length !== landscapeSnapPoints.length) {
      console.error(
        'BottomSheet: portraitSnapPoints and landscapeSnapPoints arrays must be of same length',
      );
    }

    return (
      <>
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
          }}
          pointerEvents="none"
          onLayout={({ nativeEvent }) => {
            const { height, width } = nativeEvent.layout;
            // If current orientation is different than previous, swap snap points
            if (height > width !== isPortrait) {
              setSnapPoints(isPortrait ? landscapeSnapPoints : portraitSnapPoints);
            }
          }}
        />
        <ReanimatedBottomSheet
          ref={ref}
          snapPoints={snapPoints}
          renderContent={renderContent}
          enabledManualSnapping
          {...rest}
        />
      </>
    );
  },
);

export default BottomSheet;
