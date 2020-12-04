import React from 'react';
import { FlatList, View, Platform } from 'react-native';
import { Button, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { StepperViewPageProps, InlineCard } from '@components/index';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { Account, State, EventPlace } from '@ts/types';
import { Format, useTheme } from '@utils';

import getAuthStyles from '../styles/Styles';
import PlaceAddressModal from './PlaceAddressModal';
import PlaceSelectModal from './PlaceSelectModal';
import PlaceTypeModal from './PlaceTypeModal';

type Props = StepperViewPageProps & {
  account: Account;
};

const EventAddPagePlace: React.FC<Props> = ({ next, prev, account }) => {
  const [isPlaceTypeModalVisible, setPlaceTypeModalVisible] = React.useState(false);
  const [isPlaceSelectModalVisible, setPlaceSelectModalVisible] = React.useState(false);
  const [isPlaceAddressModalVisible, setPlaceAddressModalVisible] = React.useState(false);
  const [placeType, setPlaceType] = React.useState<'place' | 'school'>('place');

  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const [eventPlaces, setEventPlaces] = React.useState<EventPlace[]>([]);
  const toSelectedType = (type: 'place' | 'school' | 'standalone') => {
    setPlaceTypeModalVisible(false);
    if (type === 'standalone') {
      setPlaceAddressModalVisible(true);
    } else {
      setPlaceType(type);
      setPlaceSelectModalVisible(true);
    }
  };

  const addEventPlace = (place: EventPlace) => {
    const previousEventIds = eventPlaces.map((p) => p._id);
    if (!previousEventIds.includes(place._id)) {
      setEventPlaces([...eventPlaces, place]);
    }
  };

  const submit = () => {
    updateEventCreationData({ place: eventPlaces });
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
    <View style={eventStyles.formContainer}>
      <List.Subheader>Lieux Sélectionnés</List.Subheader>
      <View style={{ marginTop: 10 }}>
        <FlatList
          keyExtractor={(place) => place._id}
          data={eventPlaces}
          renderItem={({ item: place }) => {
            return (
              <InlineCard
                icon={
                  place.type === 'school' ? 'school' : place.type === 'place' ? 'map' : 'map-marker'
                }
                title={Format.eventPlaceName(place)}
                onPress={() => {
                  setEventPlaces(eventPlaces.filter((s) => s !== place));
                }}
              />
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

      <View style={eventStyles.buttonContainer}>
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
