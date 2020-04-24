import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider, Subheading, useTheme } from 'react-native-paper';

function ListItem({ label, icon, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.surface}>
      <View>
        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          {icon && <Icon name={icon} size={20} color={colors.text} style={{ marginRight: 12 }} />}
          <Subheading>{label}</Subheading>
        </View>
      </View>
    </TouchableHighlight>
  );
}

function ListSection({ label, children }) {
  const listWithDividers = children.map((child, index) => {
    const isFirst = index === 0;
    const isLast = index === children.length - 1;
    return [
      isFirst && <Divider />,
      child,
      !isLast && <Divider style={{ alignSelf: 'center', width: '95%' }} />,
      isLast && <Divider />,
    ];
  });

  return <View>{listWithDividers}</View>;
}

export { ListItem, ListSection };

ListItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

ListItem.defaultProps = {
  icon: null,
  onPress: null,
};
