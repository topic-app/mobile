import React, { useEffect, useRef } from 'react';
import { View, Dimensions, Animated, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { logger } from '@utils';

const deviceWindow = Dimensions.get('window');

type StrengthMeterProps = {
  level: number;
  levels?: number;
  labels?: string[];
  showLabels?: boolean;
};

const StrengthMeter: React.FC<StrengthMeterProps> = ({
  level,
  levels = 4,
  labels = ['Très Faible', 'Faible', 'Bon', 'Parfait'],
  showLabels = true,
}) => {
  if (levels !== labels.length) {
    logger.error(
      'StrengthMeter: levels must be the same value of labels.length, please make sure you have defined a label for each level',
    );
  }
  const barWidth = deviceWindow.width < 600 ? deviceWindow.width * 0.9 : 550;
  const animateVal = useRef(new Animated.Value(0)).current;
  const animateColor = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animateVal, {
      bounciness: 15,
      toValue: barWidth * (level / levels),
      useNativeDriver: false,
    }).start();

    Animated.timing(animateColor, {
      toValue: level,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [level]);

  const { colors } = useTheme();

  const color = animateColor.interpolate({
    inputRange: [0, levels],
    outputRange: [colors.error, colors.valid],
  });

  return (
    <View style={{ alignSelf: 'center' }}>
      <View style={styles.backBar} />
      <Animated.View
        style={[
          styles.mainBar,
          {
            backgroundColor: color,
            width: animateVal,
          },
        ]}
      />
      <Animated.Text style={{ margin: 10, marginTop: 5, color }}>
        {showLabels && level !== 0 ? labels[level - 1] : ''}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  backBar: {
    backgroundColor: 'gray',
    width: deviceWindow.width < 600 ? deviceWindow.width * 0.9 : 550,
    height: 10,
    borderRadius: 25,
  },
  mainBar: {
    position: 'absolute',
    backgroundColor: 'blue',
    height: 10,
    borderRadius: 25,
  },
});

export default StrengthMeter;
