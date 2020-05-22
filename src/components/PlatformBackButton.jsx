import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function PlatformBackButton({ onPress }) {
  const theme = useTheme();
  const { colors } = theme;
  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity onPress={onPress}>
        <Icon name="chevron-left" color={colors.text} size={30} />
      </TouchableOpacity>
    );
  }
  return <IconButton icon="arrow-left" size={25} onPress={onPress} />;
}

PlatformBackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default PlatformBackButton;
