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
      title="Envoyer des rapports de plantage"
      description="Envoie des informations sur les plantages afin de nous aider à les résoudre"
      onPress={() => onPress()}
      right={() => <Switch value={value} disabled={disabled} onValueChange={() => onPress()} />}
      descriptionNumberOfLines={3}
      style={{ padding: 6 }}
      {...rest}
    />
  );
};
