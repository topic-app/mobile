import React from 'react';
import { View, TouchableOpacity, Platform, TextStyle, StyleProp } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type ListHeadingProps = {
  label: string;
};

const ListHeading: React.FC<ListHeadingProps> = ({ label }) => {
  return <Text style={{ paddingHorizontal: 19, fontWeight: 'bold' }}>{label}</Text>;
};

type ListItemProps = {
  icon: string;
  iconColor?: string;
  label: string;
  textStyle?: StyleProp<TextStyle>;
};

const ListItem: React.FC<ListItemProps> = ({ icon, iconColor, label, textStyle }) => {
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
};

type ListItemAnchorProps = {
  icon: string;
  label: string;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
};

const ListItemAnchor: React.FC<ListItemAnchorProps> = ({ icon, label, onPress, textStyle }) => {
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
};

export { ListHeading, ListItem, ListItemAnchor };
