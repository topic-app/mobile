import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { StackNavigationProp } from 'react-native-screens/native-stack';

import type { ModerationStackParams } from '../index';
import getModerationStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<ModerationStackParams, 'List'>;
};

const ModerationList: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const moderationStyles = getModerationStyles(theme);

  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
};

export default ModerationList;
