import React from 'react';
import { FlatList, View, Platform } from 'react-native';
import { Button, IconButton, List, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import shortid from 'shortid';

import { StepperViewPageProps, InlineCard } from '@components';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import { Account, State, EventCreationDataPlace } from '@ts/types';
import { Format } from '@utils';

import getStyles from '../styles';
import PlaceAddressModal from './PlaceAddressModal';
import PlaceOnlineModal from './PlaceOnlineModal';
import PlaceSelectModal from './PlaceSelectModal';
import PlaceTypeModal from './PlaceTypeModal';

type Props = StepperViewPageProps & {
  account: Account;
};

const EventAddPagePlace: React.FC<Props> = ({ next, prev, account }) => {
  const [isPlaceTypeModalVisible, setPlaceTypeModalVisible] = React.useState(false);
  const [isPlaceSelectModalVisible, setPlaceSelectModalVisible] = React.useState(false);
  const [isPlaceAddressModalVisible, setPlaceAddressModalVisible] = React.useState(false);
  const [isPlaceOnlineModalVisible, setPlaceOnlineModalVisible] = React.useState(false);
  const [placeType, setPlaceType] = React.useState<'school' | 'place' | 'standalone' | 'online'>(
    'school',
  );

  const theme = useTheme();
  const styles = getStyles(theme);

  const [eventPlaces, setEventPlaces] = React.useState<EventCreationDataPlace[]>([]);
  const toSelectedType = (data: 'school' | 'place' | 'standalone' | 'online') => {
    setPlaceTypeModalVisible(false);
    if (data === 'standalone') {
      setPlaceAddressModalVisible(true);
    } else if (data === 'online') {
      setPlaceOnlineModalVisible(true);
    } else {
      setPlaceType(data);
      setPlaceSelectModalVisible(true);
    }
  };

  const addEventPlace = (place: EventCreationDataPlace) => {
    const previousEventIds = eventPlaces.map((p) => p.id);
    if (!previousEventIds.includes(place.id)) {
      setEventPlaces([...eventPlaces, place]);
    }
  };

  const submit = () => {
    updateEventCreationData({ places: eventPlaces });
    next();
  };

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.formContainer}>
      <List.Subheader>Lieux Sélectionnés</List.Subheader>
      <View style={{ marginTop: 10 }}>
        <FlatList
          keyExtractor={(place) => place.id || shortid()}
          data={eventPlaces}
          renderItem={({ item: place }) => {
            return (
              <View style={{ flexDirection: 'row', width: 270, marginRight: 20 }}>
                <View style={{ flexGrow: 200 }}>
                  <InlineCard
                    icon={
                      place.type === 'school'
                        ? 'school'
                        : place.type === 'place'
                        ? 'map'
                        : place.type === 'online'
                        ? 'link'
                        : 'map-marker'
                    }
                    title={
                      place.type === 'standalone'
                        ? Format.address(place.address)
                        : place.type === 'online'
                        ? place.link
                            .replace('http://', '')
                            .replace('https://', '')
                            .split(/[/?#]/)[0]
                        : place.tempName ?? 'Lieu inconnu'
                    }
                    onPress={() => {
                      setEventPlaces(eventPlaces.filter((s) => s !== place));
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <IconButton
                    icon="delete"
                    size={30}
                    style={{ marginRight: 20, flexGrow: 1 }}
                    onPress={() => {
                      setEventPlaces(eventPlaces.filter((s) => s !== place));
                    }}
                  />
                </View>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.container}>
        <Button
          mode={Platform.OS === 'ios' ? 'text' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => {
            setPlaceTypeModalVisible(true);
          }}
        >
          Ajouter un lieu
        </Button>
      </View>
      <View style={{ height: 30 }} />

      <PlaceTypeModal
        visible={isPlaceTypeModalVisible}
        setVisible={setPlaceTypeModalVisible}
        next={toSelectedType}
      />
      <PlaceSelectModal
        visible={isPlaceSelectModalVisible}
        setVisible={setPlaceSelectModalVisible}
        type={placeType}
        add={addEventPlace}
      />
      <PlaceAddressModal
        visible={isPlaceAddressModalVisible}
        setVisible={setPlaceAddressModalVisible}
        add={addEventPlace}
      />
      <PlaceOnlineModal
        visible={isPlaceOnlineModalVisible}
        setVisible={setPlaceOnlineModalVisible}
        add={addEventPlace}
      />

      <View style={styles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => prev()}
          style={{ flex: 1, marginRight: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={submit}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPagePlace);
