import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Subheading, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ListItemProps = {
  label: string;
  icon: string;
  onPress: () => void;
};

const ListItem: React.FC<ListItemProps> = ({ label, icon, onPress }) => {
  const { colors } = useTheme();
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.surface}>
      <View>
        <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
          {icon && <Icon name={icon} size={20} color={colors.text} style={{ marginRight: 12 }} />}
          <Subheading>{label}</Subheading>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export { ListItem };
