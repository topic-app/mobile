import React from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function CategoryTitle({ children, icon, iconStyle, style, containerStyle, ...textProps }) {
  const { colors } = useTheme();
  return (
    <View style={[{ paddingTop: 7, flexDirection: 'row', alignItems: 'center' }, containerStyle]}>
      {icon && (
        <Icon
          name={icon}
          size={15}
          color={colors.subtext}
          style={[{ paddingRight: 4 }, iconStyle]}
        />
      )}
      <Text
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...textProps}
        style={[
          {
            fontWeight: 'bold',
            color: colors.subtext,
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          },
          style,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

// eslint-disable-next-line import/prefer-default-export
export { CategoryTitle };

CategoryTitle.defaultProps = {
  icon: null,
  style: null,
  iconStyle: null,
  containerStyle: null,
};

CategoryTitle.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  icon: PropTypes.string,
  style: ViewPropTypes.style,
  iconStyle: ViewPropTypes.style,
  containerStyle: ViewPropTypes.style,
};
