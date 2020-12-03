import React from 'react';
import { FlatList, View, Platform } from 'react-native';
import { Button, IconButton, List, Text} from 'react-native-paper';
import { useTheme } from '@utils/index';
import { StackNavigationProp } from '@react-navigation/stack';

import {ScrollView} from 'react-native-gesture-handler';
import { connect } from 'react-redux';

import { Account, State, EventCreationData, EventPlace } from '@ts/types';
import { StepperViewPageProps, InlineCard, SafeAreaView } from '@components/index';
import getStyles from '@styles/Styles';
import { updateEventCreationData } from '@redux/actions/contentData/events';

import PlaceTypeModal from './PlaceTypeModal';
import PlaceAddressModal from './PlaceAddressModal';
import PlaceSelectModal from './PlaceSelectModal';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  account: Account;
  navigation: StackNavigationProp<any, any>;
};

const EventAddPagePlace: React.FC<Props> = ({ next, prev, account }) => {
  const [isPlaceTypeModalVisible, setPlaceTypeModalVisible] = React.useState(false);
  const [isPlaceSelectModalVisible, setPlaceSelectModalVisible] = React.useState(false);
  const [isPlaceAddressModalVisible, setPlaceAddressModalVisible] = React.useState(false);
  const [placeType, setPlaceType] = React.useState<'school'|'place'|'standalone'>('school');

  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const [eventPlaces, setEventPlaces] = React.useState<EventPlace[]>([]);
  const toSelectedType = (data: 'school'|'place'|'standalone') => {
    setPlaceType(data);
    setPlaceTypeModalVisible(false);
    data === 'standalone' ? setPlaceAddressModalVisible(true) : setPlaceSelectModalVisible(true);
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
        <ScrollView>
        <List.Subheader> Lieux Sélectionnés </List.Subheader>
        <View style={{ marginTop: 10 }}>
          {eventPlaces?.map((place) => (
            <View
              key={place._id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                }}
            >
              <View style={{ flexGrow: 1, width: 250, marginRight: 20 }}>
                <InlineCard
                  key={place._id}
                  icon={
                    place.type === 'school' ? 'school' : place.type === 'place' ? 'map' : 'map-marker'
                  }
                  title={
                    place.type === 'school' || place.type === 'place'
                       ? place.tempName || place.address?.shortName
                       : `${place.address?.address.number}${
                            place.address?.address.number === '' ? '' : ' '
                         }${place.address?.address.street}${
                            place.address?.address.extra !== '' && place.address?.address.street !== ''
                            ? ', '
                            : ''
                         }${place.address?.address.extra}${
                            place.address?.address.street !== '' || place.address?.address.extra !== ''
                            ? ', '
                            : ''
                         }${place.address?.address.code} ${place.address?.address.city}`
                  }
                />
              </View>
              <View style={{ flexGrow: 1 }}>
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
          ))}
        </View>
        </ScrollView>
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
