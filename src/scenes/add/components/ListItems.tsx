import React from 'react';
import { View, Platform } from 'react-native';
import { Checkbox, List, useTheme } from 'react-native-paper';

type PlatformListItemProps = React.ComponentPropsWithoutRef<typeof List.Item> &
  React.ComponentPropsWithoutRef<typeof Checkbox>;

export const CheckboxListItem: React.FC<PlatformListItemProps> = ({
  status,
  color,
  onPress,
  ...rest
}) => {
  const { colors } = useTheme();
  return Platform.OS === 'ios' ? (
    <List.Item
      {...rest}
      onPress={onPress}
      right={() => <Checkbox status={status} color={color ?? colors.primary} onPress={onPress} />}
    />
  ) : (
    <List.Item
      {...rest}
      onPress={onPress}
      left={() => (
        <View style={{ justifyContent: 'center' }}>
          <Checkbox status={status} color={color ?? colors.primary} onPress={onPress} />
        </View>
      )}
    />
  );
};
