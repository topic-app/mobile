import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';

import getStyles from '../styles';

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
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View style={styles.profileItem}>
      <View style={{ flex: 1 }}>
        {item?.length > 0 && <Text style={styles.keyText}>{item}</Text>}
        {value?.length > 0 && (
          <Text style={[styles.valueText, { color: disabled ? colors.disabled : colors.text }]}>
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
