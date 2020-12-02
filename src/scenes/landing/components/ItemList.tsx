import React from 'react';
import { View, Platform, FlatList, ActivityIndicator } from 'react-native';
import { List, Checkbox, Text, ProgressBar } from 'react-native-paper';

import { ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';
import { SchoolRequestState, DepartmentRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

type ItemListProps = {
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

const ItemList: React.FC<ItemListProps> = ({
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

  function setId(id: string) {
    if (selected.includes(id)) {
      setGlobalSelected('remove', id);
      setSelected(selected.filter((i) => i !== id));
    } else {
      setGlobalSelected('add', id);
      setSelected([...selected, id]);
    }
  }

  const states = [state.schools.list, state.departments.list];
  // only add search states if they aren't undefined
  if (state.schools.search) states.push(state.schools.search);
  if (state.departments.search) states.push(state.departments.search);

  return (
    <View>
      {states.some((s) => s.loading.initial) && <ProgressBar indeterminate />}
      {states.some((s) => s.error) && (
        <ErrorMessage
          type="axios"
          strings={{
            what: 'Le chargement des données',
            contentPlural: 'Les données',
          }}
          error={states.map((s) => s.error)}
          retry={retry}
        />
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
                    <Text>Aucun résultat</Text>
                  </View>
                </View>
              )
            : null
        }
        ListFooterComponent={() =>
          states.some((s) => s.loading.next) ? (
            <View style={{ height: 50 }}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={{ height: 50 }} />
          )
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
