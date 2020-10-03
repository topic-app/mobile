import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import { Button, RadioButton, HelperText, List, Text, useTheme, Card } from 'react-native-paper';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import {
  StepperViewPageProps,
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
  const [placeData, setPlaceData] = React.useState([]);
  const toSelectedType = (data: string) => {
    setPlaceType(data);
    setPlaceTypeModalVisible(false);
    data === 'address' ? setPlaceAddressModalVisible(true) : setPlaceSelectModalVisible(true);
  };
  const addEventPlace = (place: { type: string; _id: string; name: string }) => {
    setEventPlaces([...eventPlaces, place._id]);
    setPlaceData([...placeData, place]);
  };

  const submit = () => {
    next();
  };

  const renderItem = React.useCallback(
    ({ item = { name: 'INCONNU' } }) => {
      return (
        <View style={{ marginHorizontal: 5, alignItems: 'flex-start', paddingBottom: 10 }}>
          <TextChip
            title={item.name}
            onPress={() => {
              setEventPlaces(eventPlaces.filter((s) => s !== item._id));
            }}
            icon={eventPlaces.includes(item._id) ? 'check' : 'pound'}
            selected={eventPlaces.includes(item._id)}
          />
        </View>
      );
    },
    [eventPlaces],
  );

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
      {eventPlaces !== [] && (
        <View style={{ marginTop: 20 }}>
          <FlatList
            data={eventPlaces.map((t) => placeData.find((u) => u?._id === t))}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(i) => i?._id}
          />
        </View>
      )}
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
