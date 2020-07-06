import React from 'react';
import { View, TextStyle, ViewStyle, TextProps, StyleProp } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CategoryTitleProps = TextProps & {
  icon?: string;
  iconStyle?: StyleProp<TextStyle>;
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
};

// eslint-disable-next-line import/prefer-default-export
export { CategoryTitle };
