import Color from 'color';
import React from 'react';
import { Platform, View } from 'react-native';
import { Avatar, Divider, List, Switch, Text, useTheme, RadioButton } from 'react-native-paper';

type ListItemPropsWithoutOnPress = Omit<
  React.ComponentPropsWithoutRef<typeof List.Item>,
  'onPress'
>;

type SettingProps = ListItemPropsWithoutOnPress & { onPress?: () => any };

export const Setting: React.FC<SettingProps> = ({ onPress, disabled, ...rest }) => {
  const { colors } = useTheme();
  return (
    <List.Item
      titleStyle={disabled && { color: colors.disabled }}
      descriptionStyle={disabled && { color: colors.disabled }}
      onPress={onPress ? () => onPress() : undefined}
      descriptionNumberOfLines={3}
      style={{ padding: 6 }}
      {...rest}
    />
  );
};

type SettingToggleProps = ListItemPropsWithoutOnPress & {
  value: boolean;
  onPress: () => any;
};

export const SettingToggle: React.FC<SettingToggleProps> = ({
  value,
  onPress,
  disabled,
  ...rest
}) => {
  const { colors } = useTheme();
  return (
    <List.Item
      onPress={() => onPress()}
      titleStyle={disabled && { color: colors.disabled }}
      descriptionStyle={disabled && { color: colors.disabled }}
      right={() => <Switch value={value} disabled={disabled} onValueChange={() => onPress()} />}
      descriptionNumberOfLines={3}
      style={{ padding: 6 }}
      {...rest}
    />
  );
};

type SettingRadioProps = ListItemPropsWithoutOnPress & {
  checked: boolean;
  onPress: () => any;
};

export const SettingRadio: React.FC<SettingRadioProps> = ({
  checked,
  onPress,
  disabled,
  ...rest
}) => (
  <List.Item
    onPress={() => onPress()}
    left={
      Platform.OS !== 'ios'
        ? () => (
            <RadioButton
              value=""
              status={checked ? 'checked' : 'unchecked'}
              disabled={disabled}
              onPress={() => onPress()}
            />
          )
        : undefined
    }
    right={
      Platform.OS === 'ios'
        ? () => (
            <RadioButton
              value=""
              status={checked ? 'checked' : 'unchecked'}
              disabled={disabled}
              onPress={() => onPress()}
            />
          )
        : undefined
    }
    descriptionNumberOfLines={3}
    style={{ padding: 6 }}
    {...rest}
  />
);

type SettingSection = {
  title?: string;
  bottomDivider?: boolean;
};

export const SettingSection: React.FC<SettingSection> = ({ title, bottomDivider, children }) => {
  const { colors } = useTheme();
  return (
    <List.Section>
      {title && (
        <List.Subheader
          style={{ color: colors.primary, paddingHorizontal: 14, paddingVertical: 0 }}
        >
          {title}
        </List.Subheader>
      )}
      {children}
      {bottomDivider && <Divider />}
    </List.Section>
  );
};

type SettingTooltip = { tooltip: string; icon: string };

export const SettingTooltip: React.FC<SettingTooltip> = ({ tooltip, icon }) => {
  const { colors } = useTheme();
  return (
    <View>
      <Divider />
      <View
        style={{
          backgroundColor: colors.surface,
          flex: 1,
          flexDirection: 'row',
          paddingVertical: 12,
          paddingHorizontal: 15,
        }}
      >
        <Avatar.Icon
          size={40}
          style={{ backgroundColor: colors.disabled, marginRight: 15, marginTop: 2 }}
          icon={icon}
        />
        <Text style={{ flex: 1, color: Color(colors.text).alpha(0.8).rgb().string() }}>
          {tooltip}
        </Text>
      </View>
      <Divider />
    </View>
  );
};
