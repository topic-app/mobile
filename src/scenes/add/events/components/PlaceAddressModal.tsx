import React from 'react';
import {
  ModalProps,
  State,
  EventPlace,
  ArticleQuickItem,
  TagsState,
  GroupsState,
  UsersState,
  Tag,
  Group,
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
import { View, Platform, FlatList, TextInput as RNTestInput } from 'react-native';
import { connect } from 'react-redux';
import Modal, { BottomModal, SlideAnimation } from '@components/Modals';
import { updateEventCreationData } from '@redux/actions/contentData/events';

import { Searchbar, Illustration, Avatar, ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';
import { addArticleQuick } from '@redux/actions/contentData/articles';
import { searchTags, updateTags } from '@redux/actions/api/tags';
import { searchGroups, updateGroups } from '@redux/actions/api/groups';
import { searchUsers, updateUsers } from '@redux/actions/api/users';

import getEventStyles from '../styles/Styles';
 
type PlaceAddressModalProps = ModalProps & {
  type: 'standalone';
  eventPlaces:EventPlace[];
  add: ({ type, address, associatedSchool, associatedPlace }: { type : string, address: {shortName:string|null, geo:null, address:{number:string|null,street:string|null,extra:string|null,city:string|null,code:string|null}|null,departments:[]}, associatedSchool: string|null,associatedPlace: string|null,}) => any;
};

function PlaceAddressModal({ visible, setVisible, type, eventPlaces, add  }: PlaceAddressModalProps) {
  const numberInput = React.createRef<RNTestInput>();
  const streetInput = React.createRef<RNTestInput>();
  const codeInput = React.createRef<RNTestInput>();
  const cityInput = React.createRef<RNTestInput>();
  const eventPlace = eventPlaces;

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempNumber: InputStateType;
  let tempStreet: InputStateType;
  let tempCode: InputStateType;
  let tempCity: InputStateType;

  const [currentNumber, setCurrentNumber] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [currentStreet, setCurrentStreet] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [currentCode, setCurrentCode] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [currentCity, setCurrentCity] = React.useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  function setNumber(data: Partial<InputStateType>) {
    // Because async setState
    tempNumber = { ...currentNumber, ...(tempNumber ?? {}), ...data };
    setCurrentNumber(tempNumber);
  }
  function setStreet(data: Partial<InputStateType>) {
    tempStreet = { ...currentStreet, ...(tempStreet ?? {}), ...data };
    setCurrentStreet(tempStreet);
  }
  function setCode(data: Partial<InputStateType>) {
    // Because async setState
    tempCode = { ...currentCode, ...(tempCode ?? {}), ...data };
    setCurrentCode(tempCode);
  }
  function setCity(data: Partial<InputStateType>) {
    tempCity = { ...currentCity, ...(tempCity ?? {}), ...data };
    setCurrentCity(tempCity);
  }

  function blurInputs() {
    numberInput.current?.blur();
    streetInput.current?.blur();
    codeInput.current?.blur();
    cityInput.current?.blur();
  }

  async function validateCityInput(city: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (city === undefined) {
      validation = {
        valid: false,
        error: true,
        message: 'Champ requis',
      };
    } else {
      validation = { valid: true, error: false };
    }
    setCity(validation);
    return validation;
  }

  async function submit() {
    const numberVal = currentNumber.value;
    const streetVal = currentStreet.value;
    const codeVal = currentCode.value;
    const cityVal = currentCity.value;
    const city = await validateCityInput(cityVal);
    if (city.valid) {
      updateEventCreationData({
        type,
        address: {shortName:null, geo:null, address:{number:numberVal,street:streetVal,extra:null,city:cityVal,code:codeVal},departments:[]},
        associatedSchool: null,
        associatedPlace: null,
      });
      add({type,
        address: {shortName:null, geo:null, address:{number:numberVal,street:streetVal,extra:null,city:cityVal,code:codeVal},departments:[]},
        associatedSchool: null,
        associatedPlace: null,
      });
      setVisible(false);
      setCurrentNumber({ value: '' });
      setCurrentStreet({ value: '' });
      setCurrentCode({ value: '' });
      setCurrentCity({ value: '' });
    } else {
      if (!city.valid && !city.error) {
        setCity({
          valid: false,
          error: true,
          message: 'Champ requis',
        });
      }
    }
  }

  async function cancel() {
    setVisible(false);
    setNumber({ value: '' });
    setStreet({ value: '' });
    setCode({ value: '' });
    setCity({ value: '' });
  }

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getEventStyles(theme);
  const styles = getStyles(theme);

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
          <View style={eventStyles.formContainer}>
            <View style={eventStyles.textInputContainer}>
              <TextInput
                ref={numberInput}
                label="Numéro de rue"
                value={currentNumber.value}
                error={currentNumber.error}
                keyboardType="default"
                disableFullscreenUI
                onSubmitEditing={() => {
                  streetInput.current?.focus();
                }}
                autoCorrect={false}
                autoFocus
                theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
                mode="outlined"
                style={eventStyles.textInput}
                onChangeText={(text) => {
                  setNumber({ value: text });
                }}
              />
            </View>
            <View style={eventStyles.textInputContainer}>
              <TextInput
                ref={streetInput}
                label="Rue"
                value={currentStreet.value}
                error={currentStreet.error}
                disableFullscreenUI
                onSubmitEditing={() => {
                  codeInput.current?.focus();
                }}
                autoCorrect={false}
                autoFocus
                theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
                mode="outlined"
                style={eventStyles.textInput}
                onChangeText={(text) => {
                  setStreet({ value: text });
                }}
              />
            </View>
            <View style={eventStyles.textInputContainer}>
              <TextInput
                ref={codeInput}
                label="Code Postal"
                value={currentCode.value}
                error={currentCode.error}
                keyboardType="number-pad"
                disableFullscreenUI
                onSubmitEditing={() => {
                  cityInput.current?.focus();
                }}
                autoCorrect={false}
                autoFocus
                theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
                mode="outlined"
                style={eventStyles.textInput}
                onChangeText={(text) => {
                  setCode({ value: text });
                }}
              />
            </View>
            <View style={eventStyles.textInputContainer}>
              <TextInput
                ref={cityInput}
                label="Ville"
                value={currentCity.value}
                error={currentCity.error}
                disableFullscreenUI
                onSubmitEditing={() => {
                  blurInputs();
                }}
                autoCorrect={false}
                autoFocus
                theme={
                  currentCity.valid
                    ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                    : theme
                }
                mode="outlined"
                style={eventStyles.textInput}
                onChangeText={(text) => {
                  setCity({ value: text });
                }}
              />
              <HelperText type="error" visible={currentCity.error}>
                {currentCity.message}
              </HelperText>
            </View>
            <View style={{ height: 20 }} />
            <View style={eventStyles.buttonContainer}>
              <Button
                mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                uppercase={Platform.OS !== 'ios'}
                style={{ flex: 1, marginRight: 5 }}
                onPress={() => {
                  blurInputs();
                  cancel();
                }}
              >
                {' '}
                Annuler{' '}
              </Button>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                onPress={() => {
                  blurInputs();
                  submit();
                }}
                style={{ flex: 1, marginLeft: 5 }}
              >
                {' '}
                Ajouter
              </Button>
            </View>
          </View>
        </Card>
      </ThemeProvider>
    </BottomModal>
  );
}

const mapStateToProps = (state: State) => {
  const { eventData, number, street, code, city } = state;
  return {
    creationData: eventData.creationData,
    number,
    street,
    code,
    city,
  };
};

export default connect(mapStateToProps)(PlaceAddressModal);
