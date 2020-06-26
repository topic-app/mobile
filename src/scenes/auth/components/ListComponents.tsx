import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Text, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';

function ListHeading({ label }) {
  return <Text style={{ paddingHorizontal: 19, fontWeight: 'bold' }}>{label}</Text>;
}
ListHeading.propTypes = {
  label: PropTypes.string.isRequired,
};

function ListItem({ icon, iconColor, label, textStyle }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row' }}>
      <MaterialCommunityIcons
        style={{ paddingTop: 2.5, paddingRight: 3 }}
        size={15}
        color={iconColor ?? colors.icon}
        name={icon}
      />
      <Text style={textStyle}>{label}</Text>
    </View>
  );
}

ListItem.defaultProps = {
  iconColor: null,
  textStyle: null,
};

ListItem.propTypes = {
  icon: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  label: PropTypes.string.isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

function ListItemAnchor({ icon, label, onPress, textStyle }) {
  const { colors } = useTheme();

  // Note: TouchableWithoutFeedback needs a child that is a View
  return (
    <TouchableOpacity activeOpacity={Platform.OS === 'ios' ? 0.2 : 0.6} onPress={onPress}>
      <View>
        <ListItem
          icon={icon}
          iconColor={colors.primary}
          label={label}
          textStyle={[{ textDecorationLine: 'underline', color: colors.primary }, textStyle]}
        />
      </View>
    </TouchableOpacity>
  );
}

ListItemAnchor.defaultProps = {
  textStyle: null,
};

ListItemAnchor.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  textStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export { ListHeading, ListItem, ListItemAnchor };