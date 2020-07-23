import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import { useTheme, List, Checkbox, Text, ProgressBar } from 'react-native-paper';

import { SchoolRequestState, DepartmentRequestState } from '@ts/types';
import { ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';

type Props = {
  type: 'school' | 'department' | 'region' | 'other';
  data: {
    key: string;
    title: string;
    description: string;
  }[];
  initialSelected: string[];
  setGlobalSelected: (method: 'add' | 'remove', item: string) => void;
  state: {
    schools: SchoolRequestState;
    departments: DepartmentRequestState;
  };
  retry: () => void;
  next: () => void;
};

const ItemList: React.FC<Props> = ({
  type,
  data,
  initialSelected,
  setGlobalSelected,
  state,
  retry,
  next,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const [selected, setSelected] = React.useState(initialSelected);

  function setId(id) {
    if (selected.includes(id)) {
      setGlobalSelected('remove', id);
      setSelected(selected.filter((i) => i !== id));
    } else {
      setGlobalSelected('add', id);
      setSelected([...selected, id]);
    }
  }

  const states = [
    state.schools.list,
    state.departments.list,
    state.schools.search,
    state.departments.search,
  ];

  return (
    <View>
      {states.some((s) => s.loading.initial) && <ProgressBar indeterminate />}
      {states.some((s) => s.error) && (
        <ErrorMessage type="axios" error={states.map((s) => s.error)} retry={retry} />
      )}
      <FlatList
        data={data}
        keyExtractor={(i) => i.key}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          states.every((s) => !s.loading.initial && !s.error)
            ? () => (
                <View style={styles.container}>
                  <View style={styles.centerIllustrationContainer}>
                    <Text color={colors.text}>Aucun résultat</Text>
                  </View>
                </View>
              )
            : null
        }
        onEndReached={next}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.description}
            descriptionNumberOfLines={1}
            onPress={() => setId(item.key)}
            left={() =>
              Platform.OS !== 'ios' ? (
                <View style={{ alignSelf: 'center' }}>
                  <Checkbox
                    status={selected.includes(item.key) ? 'checked' : 'unchecked'}
                    color={colors.primary}
                  />
                </View>
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <View style={{ alignSelf: 'center' }}>
                  <Checkbox
                    status={item.key in selected ? 'checked' : 'unchecked'}
                    color={colors.primary}
                  />
                </View>
              ) : null
            }
          />
        )}
      />
    </View>
  );
};

export default ItemList;
