import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import { Button, RadioButton, HelperText, List, Text, useTheme, Card } from 'react-native-paper';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import {
  StepperViewPageProps,
  InlineCard,
  TextChip,
  ErrorMessage,
  CollapsibleView,
  CategoryTitle,
} from '@components/index';
import { Account, State, EventCreationData, UPDATE_PLACES_DATA } from '@ts/types';
import { updateUpcomingEvents, searchEvents } from '@redux/actions/api/events';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlaceTypeModal from './PlaceTypeModal';

import PlaceAddressModal from './PlaceAddressModal';
import PlaceSelectModal from './PlaceSelectModal';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';

type Props = StepperViewPageProps & {
  account: Account;
  creationData: EventCreationData;
  navigation: any;
};

const EventAddPagePlace: React.FC<Props> = ({ next, prev, account, creationData }) => {
  const [showError, setError] = React.useState(false);
  const [isPlaceTypeModalVisible, setPlaceTypeModalVisible] = React.useState(false);
  const [isPlaceSelectModalVisible, setPlaceSelectModalVisible] = React.useState(false);
  const [isPlaceAddressModalVisible, setPlaceAddressModalVisible] = React.useState(false);
  const [placeType, setPlaceType] = React.useState('');

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);
  const [eventPlaces, setEventPlaces] = React.useState([]);
  const toSelectedType = (data: string) => {
    setPlaceType(data);
    setPlaceTypeModalVisible(false);
    data === 'standalone' ? setPlaceAddressModalVisible(true) : setPlaceSelectModalVisible(true);
  };
  const addEventPlace = (place: {type : 'school'|'standalone'|'place', address: {shortName:string|null, geo:null, address:{number:string|null,street:string|null,extra:string|null,city:string|null,code:string|null}|null,departments:[]}, associatedSchool: string|null,associatedPlace: string|null,}) => {
    setEventPlaces([...eventPlaces, place]);
  };


  const submit = () => {
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
       <List.Subheader> Lieux Sélectionnés </List.Subheader>
      {eventPlaces.length === 0 && (<View><Text>Aucun lieu sélectionné</Text></View>)}
        <View style={{ marginTop: 20 }}>
          {eventPlaces.map((place) => (
        <InlineCard
        icon={place.type === 'school' ? 'school' : place.type === 'place' ? 'map' : 'map-marker'}
        title={place.type === 'school' || place.type === 'place' ? place.address.shortName : `${place.address.address.number || ''}${place.address.address.number === '' ? '' : ' '}${place.address.address.street || ''}${place.address.address.extra !== '' ? ', ' : ''}${place.address.address.extra || ''}${(place.address.address.street !== '' || place.address.address.extra !== '') && ', ' || ''}${place.address.address.code || ''} ${place.address.address.city}`}
        onPress={() => {
          setEventPlaces(eventPlaces.filter((s) => s !== place));}}
          />))}
        </View>
        {eventPlaces === [] && (<View> <Text> Aucun lieu sélectionné </Text></View>)}
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
