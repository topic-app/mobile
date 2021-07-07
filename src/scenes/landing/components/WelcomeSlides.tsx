import React from 'react';
import { View, Image } from 'react-native';
import { List, Checkbox, useTheme } from 'react-native-paper';

const homepage_illustration = require('@assets/images/bigillustrations/homepage.png');

const WelcomeSlides: React.FC = () => {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Image
        resizeMode="contain"
        style={{ height: 'calc(100vh - 250px)' }}
        source={homepage_illustration}
      />
    </View>
  );
};

export default WelcomeSlides;
