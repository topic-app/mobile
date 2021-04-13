import React from 'react';
import { List, Switch } from 'react-native-paper';

type SettingToggleProps = Omit<React.ComponentPropsWithoutRef<typeof List.Item>, 'onPress'> & {
  value: boolean;
  onPress: () => any;
};

export const SettingToggle: React.FC<SettingToggleProps> = ({
  value,
  onPress,
  disabled,
  ...rest
}) => {
  return (
    <List.Item
      onPress={() => onPress()}
      right={() => <Switch value={value} disabled={disabled} onValueChange={() => onPress()} />}
      descriptionNumberOfLines={3}
      style={{ padding: 6 }}
      {...rest}
    />
  );
};
