import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, FlatList } from 'react-native';
import { useTheme, List, Checkbox, ProgressBar } from 'react-native-paper';
import { updateSchools } from '@redux/actions/api/schools';
import { updateDepartments } from '@redux/actions/api/departments';
import ErrorMessage from '@components/ErrorMessage';

function ItemList({ type, data, setGlobalSelected, state }) {
  const theme = useTheme();
  const { colors } = theme;

  const [selected, setSelected] = React.useState([]);

  function setId(id) {
    if (selected.includes(id)) {
      setGlobalSelected('remove', id);
      setSelected(selected.filter((i) => i !== id));
    } else {
      setGlobalSelected('add', id);
      setSelected([...selected, id]);
    }
  }

  return (
    <View>
      {(state.schools.list.loading.initial || state.departments.list.loading.initial) && (
        <ProgressBar indeterminate />
      )}
      {state.schools.list.error || state.departments.list.error ? (
        <ErrorMessage
          type="axios"
          error={[state.schools.list.error, state.departments.list.error]}
          retry={() => {
            updateSchools('initial');
            updateDepartments('initial');
          }}
        />
      ) : null}
      <FlatList
        data={data}
        keyExtractor={(i) => i._id}
        refreshing={state.schools.list.loading.refresh || state.departments.list.loading.refresh}
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

ItemList.propTypes = {
  type: PropTypes.string.isRequired,
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
    }),
    departments: PropTypes.shape({
      list: PropTypes.shape({
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
};

export default React.memo(ItemList);
