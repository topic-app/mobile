import React from 'react';
import { Button, HelperText, TextInput, Card, ThemeProvider, useTheme } from 'react-native-paper';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { BottomModal, SlideAnimation } from '@components/Modals';

import { ModalProps, State, EventPlace } from '@ts/types';
import getStyles from '@styles/Styles';

import getEventStyles from '../styles/Styles';

type PlaceAddressModalProps = ModalProps & {
  type: 'standalone';
  eventPlaces: EventPlace[];
  add: (place: EventPlace) => void;
};

const PlaceAddressModal: React.FC<PlaceAddressModalProps> = ({
  visible,
  setVisible,
  type,
  eventPlaces,
  add,
}) => {
  const numberInput = React.createRef<RNTestInput>();
  const streetInput = React.createRef<RNTestInput>();
  const extraInput = React.createRef<RNTestInput>();
  const codeInput = React.createRef<RNTestInput>();
  const cityInput = React.createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempNumber: InputStateType;
  let tempStreet: InputStateType;
  let tempExtra: InputStateType;
  let tempCode: InputStateType;
  let tempCity: InputStateType;

  const [currentNumber, setCurrentNumber] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentStreet, setCurrentStreet] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentExtra, setCurrentExtra] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentCode, setCurrentCode] = React.useState({
    value: '',
    error: false,
    valid: true,
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
  function setExtra(data: Partial<InputStateType>) {
    tempExtra = { ...currentExtra, ...(tempExtra ?? {}), ...data };
    setCurrentExtra(tempExtra);
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
    extraInput.current?.blur();
    codeInput.current?.blur();
    cityInput.current?.blur();
  }

  const validateCityInput = (city: string) => {
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
  };

  const validateCodeInput = (code: string) => {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (code !== '' && code.length !== 5) {
      validation = {
        valid: false,
        error: true,
        message: 'Code postal erroné',
      };
    } else {
      validation = { valid: true, error: false };
    }
    setCode(validation);
  };

  const validateNumberInput = (number: string, street: string) => {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (number !== '' && street === '') {
      validation = {
        valid: false,
        error: true,
        message: 'Précisez la rue',
      };
    } else {
      validation = { valid: true, error: false };
    }
    setNumber(validation);
  };

  const submit = () => {
    const numberVal = currentNumber.value;
    const streetVal = currentStreet.value;
    const extraVal = currentExtra.value;
    const codeVal = currentCode.value;
    const cityVal = currentCity.value;
    if (currentCity.valid && currentCode.valid && currentNumber.valid) {
      add({
        id: shortid(),
        type,
        address: {
          shortName: null,
          geo: null,
          address: {
            number: numberVal,
            street: streetVal,
            extra: extraVal,
            city: cityVal,
            code: codeVal,
          },
          departments: [],
        },
        associatedSchool: null,
        associatedPlace: null,
      });
      setVisible(false);
      setCurrentNumber({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentStreet({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentExtra({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentCode({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentCity({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
    }
  };

  const cancel = () => {
    setVisible(false);
    setNumber({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setStreet({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setExtra({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCode({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCity({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
  };

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
            {currentNumber.error && (
              <HelperText type="error" style={{ marginBottom: 10, marginTop: -5 }}>
                {currentNumber.message}
              </HelperText>
            )}
            <View style={eventStyles.textInputContainer}>
              <TextInput
                ref={streetInput}
                label="Rue"
                value={currentStreet.value}
                error={currentStreet.error}
                disableFullscreenUI
                onSubmitEditing={() => {
                  extraInput.current?.focus();
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
                ref={extraInput}
                label="Autre"
                value={currentExtra.value}
                error={currentExtra.error}
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
                  setExtra({ value: text });
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
                onSubmitEditing={({ nativeEvent }) => {
                  validateCodeInput(nativeEvent.text);
                  cityInput.current?.focus();
                }}
                onEndEditing={({ nativeEvent }) => {
                  validateCodeInput(nativeEvent.text);
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
            {currentCode.error && (
              <HelperText type="error" style={{ marginBottom: 10, marginTop: -5 }}>
                {currentCode.message}
              </HelperText>
            )}
            <View style={eventStyles.textInputContainer}>
              <TextInput
                ref={cityInput}
                label="Ville"
                value={currentCity.value}
                error={currentCity.error}
                disableFullscreenUI
                onSubmitEditing={({ nativeEvent }) => {
                  validateCityInput(nativeEvent.text);
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
                onEndEditing={({ nativeEvent }) => {
                  validateCityInput(nativeEvent.text);
                }}
                onChangeText={(text) => {
                  setCity({ value: text });
                }}
              />
              <HelperText type="error" visible={currentCity.error} style={{ marginTop: -5 }}>
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
                  validateCityInput(currentCity.value);
                  validateCodeInput(currentCode.value);
                  validateNumberInput(currentNumber.value, currentStreet.value);
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
};

const mapStateToProps = (state: State) => {
  const { eventData } = state;
  return {
    creationData: eventData.creationData,
  };
};

export default connect(mapStateToProps)(PlaceAddressModal);
