import React from 'react';
import { View, Platform } from 'react-native';
import { Button, RadioButton, HelperText, List, Text, useTheme, Card } from 'react-native-paper';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import { StepperViewPageProps } from '@components/index';
import { Account, State } from '@ts/types';
import { updateUpcomingEvents, searchEvents } from '@redux/actions/api/events';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PlaceTypeModal from './PlaceTypeModal';

import PlaceAddressModal from './PlaceAddressModal';
import PlaceSelectModal from './PlaceSelectModal';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';

type Props = StepperViewPageProps & { account: Account };

const EventAddPagePlace: React.FC<Props> = ({ next, prev, account }) => {
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
    data === 'address' ? setPlaceAddressModalVisible(true) : setPlaceSelectModalVisible(true);
  };
  const addEventPlace = (newEventPlace) => setEventPlaces([...eventPlaces, newEventPlace]);

  const submit = () => {
    {
      /* updateEventCreationData({ tags: selectedTags }); */
    }
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
      {/* <CollapsibleView collapsed={selectedTags.length === 0} style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 15 }}>
          <CategoryTitle>Adresse</CategoryTitle>
        </View>
        <FlatList
          vertical
          data={selectedTags.map((t) => selectedData.find((u) => u?._id === t))}
          renderItem={renderItem}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(i) => i?._id}
        />
      </CollapsibleView> */}
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
