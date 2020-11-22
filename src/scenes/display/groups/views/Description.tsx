import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { Content } from '@components/index';
import getStyles from '@styles/Styles';
import { GroupsState, State } from '@ts/types';
import { useTheme } from '@utils/index';

import type { GroupDisplayScreenNavigationProp, GroupDisplayStackParams } from '../index';

type GroupDescriptionProps = {
  navigation: GroupDisplayScreenNavigationProp<'Description'>;
  route: RouteProp<GroupDisplayStackParams, 'Description'>;
  groups: GroupsState;
};

const GroupDescription: React.FC<GroupDescriptionProps> = ({ route, groups }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { id } = route.params;

  const group =
    groups.item?._id === id
      ? groups.item
      : groups.data.find((g) => g._id === id) || groups.search.find((g) => g._id === id) || null;

  const { data, parser } = group?.description || {};

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

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return {
    groups,
  };
};

export default connect(mapStateToProps)(GroupDescription);
