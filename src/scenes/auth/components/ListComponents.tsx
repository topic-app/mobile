import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function ListHeading({ label }) {
  return <Text style={{ paddingHorizontal: 19, fontWeight: 'bold' }}>{label}</Text>;
}
ListHeading.propTypes = {
  label: PropTypes.string.isRequired,
};

function ListItemUnthemed({ icon, iconColor, label, textStyle, theme }) {
  const { colors } = theme;
  const color = iconColor || colors.text;
  return (
    <View style={{ flexDirection: 'row' }}>
      <MaterialCommunityIcons
        style={{ paddingTop: 2.5, paddingRight: 3 }}
        size={15}
        color={iconColor}
        name={icon}
      />
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}
ListItemUnthemed.defaultProps = {
  iconColor: null,
  textStyle: null,
};
ListItemUnthemed.propTypes = {
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  label: PropTypes.string.isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
const ListItem = withTheme(ListItemUnthemed);

function ListItemAnchorUnthemed({ icon, label, onPress, textStyle, theme }) {
  const { colors } = theme;
  // Note: TouchableWithoutFeedback needs a child that is a View
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
        <ListItem
          icon={icon}
          iconColor={colors.primary}
          label={label}
          textStyle={[{ textDecorationLine: 'underline', color: colors.primary }, textStyle]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
ListItemAnchorUnthemed.defaultProps = {
  textStyle: null,
};
ListItemAnchorUnthemed.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const ListItemAnchor = withTheme(ListItemUnthemed);

export { ListHeading, ListItem, ListItemAnchor };
