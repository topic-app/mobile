import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, FlatList } from 'react-native';
import { useTheme, List, Checkbox, ProgressBar } from 'react-native-paper';
import ErrorMessage from '@components/ErrorMessage';

function ItemList({ type, data, initialSelected, setGlobalSelected, state, retry, next }) {
  const theme = useTheme();
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
        keyExtractor={(i) => i._id}
        onEndReachedThreshold={0.5}
        keyboardShouldPersistTaps="handled"
        onEndReached={next}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.description}
            descriptionNumberOfLines={1}
            onPress={() => setId(item._id)}
            left={() =>
              Platform.OS !== 'ios' ? (
                <View style={{ alignSelf: 'center' }}>
                  <Checkbox
                    status={selected.includes(item._id) ? 'checked' : 'unchecked'}
                    color={colors.primary}
                  />
                </View>
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <View style={{ alignSelf: 'center' }}>
                  <Checkbox
                    status={item._id in selected ? 'checked' : 'unchecked'}
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
}

ItemList.defaultProps = {
  initialSelected: [],
};

ItemList.propTypes = {
  type: PropTypes.string.isRequired,
  retry: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  setGlobalSelected: PropTypes.func.isRequired,
  state: PropTypes.shape({
    schools: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.oneOf([PropTypes.object, null]).isRequired, // TODO: Better PropTypes
      }).isRequired,
      search: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.oneOf([PropTypes.object, null]).isRequired, // TODO: Better PropTypes
      }).isRequired,
    }),
    departments: PropTypes.shape({
      list: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.oneOf([PropTypes.object, null]).isRequired, // TODO: Better PropTypes
      }).isRequired,
      search: PropTypes.shape({
        loading: PropTypes.shape({
          initial: PropTypes.bool.isRequired,
          refresh: PropTypes.bool.isRequired,
        }),
        error: PropTypes.oneOf([PropTypes.object, null]).isRequired, // TODO: Better PropTypes
      }).isRequired,
    }),
  }).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
  initialSelected: PropTypes.arrayOf(PropTypes.string),
};

export default React.memo(ItemList);
