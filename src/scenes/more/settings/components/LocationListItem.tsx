import React from 'react';
import { View, Platform } from 'react-native';
import { List, Checkbox, useTheme } from 'react-native-paper';

import { LocationItem } from '../utils/getNewLocations';

type LocationListItemProps = LocationItem & {
  selected: boolean;
  onAdd: (loc: LocationItem) => void;
  onRemove: (locId: string) => void;
};

const LocationListItem: React.FC<LocationListItemProps> = React.memo(
  ({ id, name, type, description, departmentIds, selected, onAdd, onRemove }) => {
    const { colors } = useTheme();
    return (
      <List.Item
        title={name}
        description={description}
        descriptionNumberOfLines={1}
        onPress={
          selected
            ? () => onRemove(id)
            : () => onAdd({ id, name, type, description, departmentIds })
        }
        left={() =>
          Platform.OS !== 'ios' ? (
            <View style={{ alignSelf: 'center' }}>
              <Checkbox status={selected ? 'checked' : 'unchecked'} color={colors.primary} />
            </View>
          ) : null
        }
        right={() =>
          Platform.OS === 'ios' ? (
            <View style={{ alignSelf: 'center' }}>
              <Checkbox status={selected ? 'checked' : 'unchecked'} color={colors.primary} />
            </View>
          ) : null
        }
      />
    );
  },
);

export default LocationListItem;
