import React from 'react';
import { View, FlatList } from 'react-native';
import { Divider, ProgressBar, Text, List, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal, Searchbar, Illustration, ErrorMessage } from '@components';
import { searchPlaces, updatePlaces } from '@redux/actions/api/places';
import { searchSchools, updateSchools } from '@redux/actions/api/schools';
import getStyles from '@styles/global';
import {
  ModalProps,
  State,
  SchoolsState,
  EventPlace,
  PlacesState,
  RequestStateComplex,
  EventCreationDataPlace,
} from '@ts/types';
import { Format } from '@utils';

type EventPlaceSelectModalProps = ModalProps & {
  type: 'school' | 'place' | 'standalone' | 'online';
  schools: SchoolsState;
  places: PlacesState;
  add: (place: EventCreationDataPlace) => void;
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

  let data: (EventPlace & { name?: string; description?: string })[] = [];
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
          name: school.displayName || school.name,
          description: school.address && Format.shortAddress(school.address),
          type: 'school',
          associatedSchool: school,
        }));
      } else {
        data = schools.data.map((school) => ({
          _id: school._id,
          name: school.displayName || school.name,
          description: school.address && Format.shortAddress(school.address),
          type: 'school',
          // Convert any School type to a SchoolPreload type
          associatedSchool: { ...school, preload: true, displayName: school.name },
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
          name: place.displayName || place.name,
          description: Format.shortAddress(place.address),
          type: 'place',
          associatedPlace: place,
        }));
      } else {
        data = places.data.map((place) => ({
          _id: place._id,
          type: 'place',
          description: Format.shortAddress(place.address),
          name: place.displayName || place.name,
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
              what: 'la r??cup??ration des donn??es',
              contentPlural: 'des donn??es',
              contentSingular: 'La liste de donn??es',
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
                    <Text>Aucun r??sultat</Text>
                  </View>
                ))}
            </View>
          )}
          renderItem={({ item }) => (
            <List.Item
              title={Format.eventPlaceName(item)}
              description={item.description}
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
                } else if (type === 'place') {
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
