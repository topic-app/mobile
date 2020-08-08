import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, IconButton } from 'react-native-paper';

import getProfileStyles from '../styles/Styles';

type Props = {
  item: string;
  value: string;
  editable?: boolean;
  disabled?: boolean;
  type?: 'public' | 'private' | 'none';
  onPress: () => any;
};

const ProfileItem: React.FC<Props> = ({
  item,
  value,
  editable = false,
  disabled = false,
  type = 'public',
  onPress,
}) => {
  const theme = useTheme();
  const profileStyles = getProfileStyles(theme);
  const { colors } = theme;

  return (
    <View style={profileStyles.profileItem}>
      <View>
        {item?.length > 0 && <Text style={profileStyles.keyText}>{item}</Text>}
        {value?.length > 0 && (
          <Text
            style={[profileStyles.valueText, { color: disabled ? colors.disabled : colors.text }]}
          >
            {value}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {type !== 'none' && (
          <View>
            {type === 'private' ? (
              <IconButton color={colors.disabled} icon="lock-outline" />
            ) : (
              <IconButton color={colors.disabled} icon="eye-outline" />
            )}
          </View>
        )}
        <View>
          {editable && <IconButton icon="pencil" color={colors.text} onPress={onPress} />}
        </View>
      </View>
    </View>
  );
};

export default ProfileItem;
