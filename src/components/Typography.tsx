import React from 'react';
import { View, TextStyle, ViewStyle, TextProps, StyleProp } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {} from 'react-native-vector-icons/index';

import { useTheme } from '@utils/index';

type CategoryTitleProps = TextProps & {
  icon?: string;
  iconStyle?: StyleProp<any>;
  containerStyle?: StyleProp<ViewStyle>;
};

const CategoryTitle: React.FC<CategoryTitleProps> = ({
  children,
  icon,
  iconStyle,
  style,
  containerStyle,
  ...textProps
}) => {
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
        style={[
          {
            fontWeight: 'bold',
            color: colors.subtext,
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          },
          style,
        ]}
        {...textProps}
      >
        {children}
      </Text>
    </View>
  );
};

// eslint-disable-next-line import/prefer-default-export
export { CategoryTitle };
