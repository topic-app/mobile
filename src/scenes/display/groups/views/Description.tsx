import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import testGroupData from '@src/data/groupListData.json';
import { Text, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import Content from '@components/Content';

function GroupDescription({ route }) {
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
}

export default GroupDescription;

GroupDescription.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
