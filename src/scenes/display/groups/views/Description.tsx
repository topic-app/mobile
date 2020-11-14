import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';

import testGroupData from '@src/data/groupListData.json';
import { Content } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

import type { GroupDisplayStackParams } from '../index';

type GroupDescriptionProps = StackScreenProps<GroupDisplayStackParams, 'Description'> & {};

const GroupDescription: React.FC<GroupDescriptionProps> = ({ route }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { id } = route.params;
  const group = testGroupData.find((g) => g._id === id);

  const { data, parser } = group.description || {};

  if (data && parser) {
    return (
      <View style={styles.page}>
        <View style={styles.contentContainer}>
          <Content parser={parser} data={data} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.page}>
      <View style={styles.contentContainer}>
        <Text>Aucune description disponible</Text>
      </View>
    </View>
  );
};

export default GroupDescription;
