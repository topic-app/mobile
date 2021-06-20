import React from 'react';
import { View, Platform, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

import getStyles from '@styles/global';

import Illustration, { IllustrationName } from './Illustration';

type FullscreenIllustrationProps = {
  illustration: IllustrationName;
  buttonLabel?: string;
  buttonOnPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const FullscreenIllustration: React.FC<FullscreenIllustrationProps> = ({
  illustration,
  children,
  buttonLabel,
  buttonOnPress = () => {},
  style,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { width, height } = useWindowDimensions();

  const size = Math.min(width * 0.7, height * 0.7, 400);

  return (
    <View style={[styles.centerIllustrationContainer, style]}>
      <Illustration name={illustration} height={size} width={size} />
      <Text>{children}</Text>
      {buttonLabel ? (
        <View style={{ marginTop: 30 }}>
          <Button uppercase={Platform.OS !== 'ios'} mode="outlined" onPress={buttonOnPress}>
            {buttonLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
};

export default FullscreenIllustration;
