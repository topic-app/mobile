import React from 'react';
import {
  Divider,
  ProgressBar,
  Card,
  Text,
  List,
  ThemeProvider,
  useTheme,
} from 'react-native-paper';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { BottomModal, SlideAnimation } from '@components/Modals';

import { ModalProps, State, SchoolsState, EventPlace, PlacesState, RequestState } from '@ts/types';
import { Searchbar, Illustration, Avatar, ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';
import { searchSchools, updateSchools } from '@redux/actions/api/schools';
import { searchPlaces, updatePlaces } from '@redux/actions/api/places';

type EventPlaceSelectModalProps = ModalProps & {
  eventPlaces: EventPlace[];
  type: 'school' | 'place';
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
  eventPlaces,
  add,
}: EventPlaceSelectModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [searchText, setSearchText] = React.useState('');

  let data: EventPlace[] = [];
  let update: (text?: string) => void = () => {};
  let icon = 'alert-decagram';
  let state: { list: RequestState; search: RequestState } = {
    list: { loading: { initial: false }, error: true },
    search: { loading: { initial: false }, error: true },
  };

  switch (type) {
    case 'school':
      data = searchText ? schools.search : schools.data;
      update = () =>
        searchText ? searchSchools('initial', searchText, {}) : updateSchools('initial');
      icon = 'school';
      state = schools.state;
      break;
    case 'place':
      data = searchText ? places.search : places.data;
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
    <BottomModal
      visible={visible}
      onTouchOutside={() => {
        setVisible(false);
      }}
      onHardwareBackPress={() => {
        setVisible(false);
        return true;
      }}
      onSwipeOut={() => {
        setVisible(false);
      }}
      modalAnimation={
        new SlideAnimation({
          slideFrom: 'bottom',
          useNativeDriver: false,
        })
      }
    >
      <ThemeProvider theme={theme}>
        <Card style={styles.modalCard}>
          <View>
            <View style={{ height: 200 }}>
              <View style={styles.centerIllustrationContainer}>
                <Illustration name="search" height={200} width={200} />
              </View>
            </View>
            <Divider />
            {state.list.loading.initial ||
              (state.search.loading.initial && (
                <ProgressBar indeterminate style={{ marginTop: -4 }} />
              ))}
            {(searchText === '' && state.list.error) ||
            (searchText !== '' && state.search.error) ? (
              <ErrorMessage
                type="axios"
                strings={{
                  what: 'la récupération des données',
                  contentPlural: 'des données',
                  contentSingular: 'La liste de données',
                }}
                error={[state.list.error, state.search.error]}
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
                    (searchText !== '' && state.search.success && (
                      <View style={styles.centerIllustrationContainer}>
                        <Text>Aucun résultat</Text>
                      </View>
                    ))}
                </View>
              )}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name || item.info?.username}
                  left={() =>
                    item.avatar || item.info?.avatar ? (
                      <Avatar avatar={item.avatar || item.info?.avatar} size={50} />
                    ) : (
                      <List.Icon icon={icon} />
                    )
                  }
                  onPress={() => {
                    if (type === 'school') {
                      add({
                        id: item._id,
                        type,
                        address: {
                          shortName: item.name,
                          coordinates: undefined,
                          address: undefined,
                          departments: [],
                        },
                        associatedSchool: item._id,
                        associatedPlace: undefined,
                      });
                    } else {
                      add({
                        id: item._id,
                        type,
                        address: {
                          shortName: item.name,
                          coordinates: undefined,
                          address: undefined,
                          departments: [],
                        },
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
        </Card>
      </ThemeProvider>
    </BottomModal>
  );
}

const mapStateToProps = (state: State) => {
  const { eventData, schools, places } = state;
  return {
    creationData: eventData.creationData,
    schools,
    places,
  };
};

export default connect(mapStateToProps)(EventPlaceSelectModal);
