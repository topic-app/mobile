import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider, ProgressBar, Text, List } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal, Searchbar, Illustration, ErrorMessage } from '@components/index';
import { searchPlaces, updatePlaces } from '@redux/actions/api/places';
import { searchSchools, updateSchools } from '@redux/actions/api/schools';
import getStyles from '@styles/Styles';
import {
  ModalProps,
  State,
  SchoolsState,
  EventPlace,
  PlacesState,
  RequestStateComplex,
} from '@ts/types';
import { Format, useTheme } from '@utils/index';

type EventPlaceSelectModalProps = ModalProps & {
  type: 'school' | 'place' | 'standalone';
  schools: SchoolsState;
  places: PlacesState;
  add: (place: EventPlace) => void;
};

function EventPlaceSelectModal({
  visible,
  setVisible,
  type,
  schools,
  places,
  add,
}: EventPlaceSelectModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [searchText, setSearchText] = React.useState('');

  let data: EventPlace[] = [];
  let update: (text?: string) => void = () => {};
  let icon = 'alert-decagram';
  let state: {
    list: RequestStateComplex;
    search?: RequestStateComplex;
  } = {
    list: { loading: { initial: false }, error: true, success: false },
    search: { loading: { initial: false }, error: true, success: false },
  };

  switch (type) {
    case 'school':
      if (searchText) {
        data = schools.search.map((school) => ({
          _id: school._id,
          type: 'school',
          associatedSchool: school,
        }));
      } else {
        data = schools.data.map((school) => ({
          _id: school._id,
          type: 'school',
          // Convert any School type to a SchoolPreload type
          associatedSchool: { preload: true, displayName: school.name, ...school },
        }));
      }
      update = () =>
        searchText ? searchSchools('initial', searchText, {}) : updateSchools('initial');
      icon = 'school';
      state = schools.state;
      break;
    case 'place':
      if (searchText) {
        data = places.search.map((place) => ({
          _id: place._id,
          type: 'place',
          associatedPlace: place,
        }));
      } else {
        data = places.data.map((place) => ({
          _id: place._id,
          type: 'place',
          // Convert any School type to a SchoolPreload type
          associatedPlace: place,
        }));
      }
      update = () =>
        searchText ? searchPlaces('initial', searchText, {}) : updatePlaces('initial');
      icon = 'map-marker-radius';
      state = places.state;
      break;
  }

  React.useEffect(() => {
    update();
  }, [type]);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={{ height: 200 }}>
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="search" height={200} width={200} />
          </View>
        </View>
        <Divider />
        {state.list.loading.initial ||
          (state.search?.loading.initial && (
            <ProgressBar indeterminate style={{ marginTop: -4 }} />
          ))}
        {(searchText === '' && state.list.error) || (searchText !== '' && state.search?.error) ? (
          <ErrorMessage
            type="axios"
            strings={{
              what: 'la récupération des données',
              contentPlural: 'des données',
              contentSingular: 'La liste de données',
            }}
            error={[state.list.error, state.search?.error]}
            retry={update}
          />
        ) : null}

        <View style={styles.container}>
          <Searchbar
            autoFocus
            placeholder="Rechercher"
            value={searchText}
            onChangeText={setSearchText}
            onIdle={update}
          />
        </View>
        <FlatList
          data={data}
          keyExtractor={(i) => i._id}
          style={{ maxHeight: 200 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={() => (
            <View style={{ minHeight: 50 }}>
              {(searchText === '' && state.list.success) ||
                (searchText !== '' && state.search?.success && (
                  <View style={styles.centerIllustrationContainer}>
                    <Text>Aucun résultat</Text>
                  </View>
                ))}
            </View>
          )}
          renderItem={({ item }) => (
            <List.Item
              title={Format.eventPlaceName(item)}
              left={() => <List.Icon icon={icon} />}
              onPress={() => {
                if (type === 'school') {
                  add({
                    id: item._id,
                    type,
                    address: undefined,
                    tempName: item.name,
                    associatedSchool: item._id,
                    associatedPlace: undefined,
                  });
                } else {
                  add({
                    id: item._id,
                    type,
                    address: undefined,
                    tempName: item.name,
                    associatedSchool: undefined,
                    associatedPlace: item._id,
                  });
                }
                setVisible(false);
              }}
            />
          )}
        />
      </View>
    </Modal>
  );
}

const mapStateToProps = (state: State) => {
  const { schools, places } = state;
  return {
    schools,
    places,
  };
};

export default connect(mapStateToProps)(EventPlaceSelectModal);
