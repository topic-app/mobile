import React from 'react';
import {
  ModalProps,
  State,
  SchoolsState,
  UsersState,
  EventListItem,
  EventPlace,
  PlacesState,
  Place,
  School,
  User,
  RequestState,
} from '@ts/types';
import {
  Divider,
  ProgressBar,
  Button,
  HelperText,
  TextInput,
  Card,
  Text,
  List,
  ThemeProvider,
  useTheme,
} from 'react-native-paper';
import { View, Platform, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { BottomModal, SlideAnimation } from '@components/Modals';

import { Searchbar, Illustration, Avatar, ErrorMessage, CollapsibleView } from '@components/index';
import getStyles from '@styles/Styles';
import { addArticleQuick } from '@redux/actions/contentData/articles';
import { searchSchools, updateSchools } from '@redux/actions/api/schools';
import { searchPlaces, updatePlaces } from '@redux/actions/api/places';

import { updateEventCreationData } from '@redux/actions/contentData/events';

import getEventStyles from '../styles/Styles';

type EventPlaceSelectModalProps = ModalProps & {
  eventPlaces: EventPlace[];
  type: 'school' | 'place';
  schools: SchoolsState;
  places: PlacesState;
};

function EventPlaceSelectModal({
  visible,
  setVisible,
  type,
  schools,
  places,
  eventPlaces,
}: EventPlaceSelectModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [searchText, setSearchText] = React.useState('');

  const eventPlace = eventPlaces;

  let data: School[] | Place[] = [];
  let update: (text?: string) => void = () => {};
  let icon = 'alert-decagram';
  let state: { list: RequestState; search: RequestState } = {
    list: { loading: { initial: false }, error: true },
    search: { loading: { initial: false }, error: true },
  };
  switch (type) {
    case 'school':
      data = searchText ? schools.search : schools.data;
      update = (text = searchText) =>
        text ? searchSchools('initial', text, {}) : updateSchools('initial');
      icon = 'school';
      state = schools.state;
      break;
    case 'place':
      data = searchText ? places.search : places.data;
      update = (text = searchText) =>
        text ? searchPlaces('initial', text, {}) : updatePlaces('initial');
      icon = 'map';
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
                      <List.Icon icon={icon} color={item.color} />
                    )
                  }
                  onPress={() => {
                    updateEventCreationData(type, item._id, item.name || item.info?.username);
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
  const { schools, places } = state;
  return {
    schools,
    places,
  };
};

export default connect(mapStateToProps)(EventPlaceSelectModal);
