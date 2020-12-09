import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';

import { useTheme } from '@utils/index';

import getProfileStyles from '../styles/Styles';

type Props = {
  item: string;
  value: string;
  editable?: boolean;
  disabled?: boolean;
  type?: 'public' | 'private' | 'none';
  onPress: () => any;
  loading?: boolean;
};

const ProfileItem: React.FC<Props> = ({
  item,
  value,
  editable = false,
  disabled = false,
  type = 'public',
  onPress,
  loading = false,
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
        {loading && <ActivityIndicator size="large" color={colors.primary} />}
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
