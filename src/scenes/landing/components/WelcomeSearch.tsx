import React from 'react';
import { View, Platform } from 'react-native';
import { List, Checkbox, useTheme, Title } from 'react-native-paper';
import Animated, { Easing, EasingNode } from 'react-native-reanimated';

import { WelcomeSearchBlob } from '@assets/index';
import { Searchbar } from '@components';
import getStyles from '@styles/global';

const WelcomeSearch: React.FC = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const searchTransition = new Animated.Value(0);

  const blobOpacity = searchTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const barTopMargin = searchTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const [text, setText] = React.useState('');

  const toAnimation = Animated.timing(searchTransition, {
    toValue: 1,
    duration: 300,
    easing: EasingNode.cubic,
  });

  const fromAnimation = Animated.timing(searchTransition, {
    toValue: 0,
    duration: 300,
    easing: EasingNode.cubic,
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', marginTop: 100 }}>
      <View>
        <Animated.View style={{ opacity: blobOpacity }}>
          <WelcomeSearchBlob style={{ width: 1000 }} />
        </Animated.View>
        <Animated.View
          style={{ position: 'absolute', alignSelf: 'center', marginTop: barTopMargin }}
        >
          <Animated.View style={{ opacity: blobOpacity }}>
            <Title
              style={[
                styles.title,
                {
                  fontSize: 30,
                  color: 'white',
                  textAlign: 'center',
                  marginBottom: 20,
                  fontWeight: '200',
                },
              ]}
            >
              Choississez votre école
            </Title>
          </Animated.View>
          <Searchbar
            value={text}
            placeholder="Rechercher"
            style={{
              width: 500,
            }}
            onChangeText={(text) => {
              setText(text);
              if (text) {
                toAnimation.start();
              } else {
                fromAnimation.start();
              }
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default WelcomeSearch;
