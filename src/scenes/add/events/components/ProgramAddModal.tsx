import React from 'react';
import { Button, Menu, HelperText, TextInput, List, Card, ThemeProvider } from 'react-native-paper';
import { View, Platform, ScrollView, TextInput as RNTestInput } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import shortid from 'shortid';
import { Modal, TabChipList } from '@components/index';

import { useTheme } from '@utils/index';
import { ModalProps, State, EventPlace, EventCreationData, Duration, Address } from '@ts/types';
import getStyles from '@styles/Styles';

import getEventStyles from '../styles/Styles';


type ProgramAddModalProps = ModalProps & {
  date: Date,
  creationData?: EventCreationData;
  setDate: () => void,
  resetDate: () => void,
  add: (program: ProgramType) => void;
};

type ProgramType = {
  _id: string;
  title: string;
  duration: {
    start: Date,
    end: Date,
  },
  description?: {
    parser?: string;
    data: string;
  };
  address?: Address;
};

const ProgramAddModal: React.FC<ProgramAddModalProps> = ({ visible, setVisible, date, setDate, resetDate, add, creationData }) => {
  const titleInput = React.createRef<RNTestInput>();
  const descriptionInput = React.createRef<RNTestInput>();
  const addressInput = React.createRef<RNTestInput>();
  const durationInput = React.createRef<RNTestInput>();
  const [isMenuVisible, setMenuVisible] = React.useState(false);
  const [durationType, setDurationType] = React.useState<'minutes'|'hours'|'days'>('hours');


  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempTitle: InputStateType;
  let tempDescription: InputStateType;
  let tempAddress: InputStateType;
  let tempDuration: InputStateType;
  let tempDate: InputStateType;

  const [currentTitle, setCurrentTitle] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentDescription, setCurrentDescription] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentAddress, setCurrentAddress] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentDuration, setCurrentDuration] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentStartDate, setCurrentStartDate] = React.useState({
    error: false,
    valid: true,
    message: '',
  });

  const jan1970 = new Date(0);

  function setTitle(data: Partial<InputStateType>) {
    tempTitle = { ...currentTitle, ...(tempTitle ?? {}), ...data };
    setCurrentTitle(tempTitle);
  }
  function setDescription(data: Partial<InputStateType>) {
    // Because async setState
    tempDescription = { ...currentDescription, ...(tempDescription ?? {}), ...data };
    setCurrentDescription(tempDescription);
  }
  function setAddress(data: Partial<InputStateType>) {
    tempAddress = { ...currentAddress, ...(tempAddress ?? {}), ...data };
    setCurrentAddress(tempAddress);
  }
  function setDuration(data: Partial<InputStateType>) {
    tempDuration = { ...currentDuration, ...(tempDuration ?? {}), ...data };
    setCurrentDuration(tempDuration);
  }
  function setStartDate(data: Partial<InputStateType>) {
    tempDate = { ...currentStartDate, ...(tempDate ?? {}), ...data };
    setCurrentStartDate(tempDate);
  }

  function blurInputs() {
    titleInput.current?.blur();
    descriptionInput.current?.blur();
    addressInput.current?.blur();
    durationInput.current?.blur();
  }

  function getEndDate(){
    let endDate: number;
    if (durationType === 'minutes'){
      endDate = Number(currentDuration.value) * 6e4 + date.valueOf();
    } else if (durationType === 'hours'){
      endDate = Number(currentDuration.value) * 3.6e6 + date.valueOf();
    } else {
      endDate = Number(currentDuration.value) * 8.64e7 + date.valueOf();
    }
    return new Date(endDate);
  }

  function validateTitleInput(title: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };
    if (title !== '') {
      if (title.length <= 10) {
        validation = {
          valid: false,
          error: true,
          message: 'Le titre doit contenir au moins 10 caractères.',
        };
      } else if (title.length >= 100) {
        validation = {
          valid: false,
          error: true,
          message: 'Le titre doit contenir moins de 100 caractères.',
        };
      } else {
        validation = { valid: true, error: false };
      }
    } else {
      validation = {
        valid: false,
        error: true,
        message: 'Le titre est requis.',
      };
    }
    setTitle(validation);
  }

  function preValidateTitleInput(title: string) {
    if (title.length >= 10 && title.length <= 100) {
      setTitle({ valid: false, error: false });
    }
  }

  function validateDescriptionInput(description: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (description !== '') {
      if (description.length >= 500) {
        validation = {
          valid: false,
          error: true,
          message: 'La description doit contenir moins de 500 caractères.',
        };
      } else if (description.length <= 10) {
          validation = {
            valid: false,
            error: true,
            message: 'La description doit contenir au moins 10 caractères.',
          };
      } else {
        validation = { valid: true, error: false };
      }
    } else {
      validation = { valid: true, error: false };
    }

    setDescription(validation);
  }

  function preValidateDescriptionInput(summary: string) {
    if (summary.length <= 500) {
      setDescription({ valid: false, error: false });
    }
  }

  function checkDuration(){
    if (currentDuration.value !== ''){
      if (moment(getEndDate()).isBetween(creationData?.start, creationData?.end)){
        setDuration({valid: true, error: false});
      } else {
          setDuration({
            valid: false,
            error: true,
            message: 'L\'élément du programme ne doit pas dépasser la date de fin de l\'évènement.'});
      }
    } else {
      setDuration({valid: false, error: true, message: 'Entrez une durée.'});
    }
  }

  function checkStartDate(){
    if (date.valueOf() !== jan1970.valueOf()){
      if (moment(date).isBetween(creationData?.start, creationData?.end)){
        setStartDate({valid: true, error: false});
      } else {
        setStartDate({
          valid: false,
          error: true,
          message: 'L\'horaire de début doit être compris entre les dates de début et de fin de l\'évènement.' });
      }
    } else {
      setStartDate({
        valid: false,
        error: true,
        message: 'Choisissez un horaire de début.' });
    }
  }

  async function  checkErrors(titleVal : string, descriptionVal : string){
    validateTitleInput(titleVal);
    validateDescriptionInput(descriptionVal);
    checkDuration();
    checkStartDate();
    return currentTitle.valid && currentDescription.valid && currentStartDate.valid && currentDuration.valid;
  }

  async function submit() {
    const titleVal = currentTitle.value;
    const descriptionVal = currentDescription.value;
    const addressVal = currentAddress.value;
    const valid = await checkErrors(titleVal, descriptionVal);
    if (valid) {
      add({
        _id: shortid(),
        title: titleVal,
        duration:{
          start: date,
          end: getEndDate(),
        },
        description:
        { data: descriptionVal,
        },
        address: {
          _id: shortid(),
          shortName: addressVal,
          coordinates: undefined,
          address: undefined,
          departments: [],
        },
      });
      setVisible(false);
      setCurrentTitle({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentDescription({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentAddress({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentDuration({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
    }
  };

  const cancel = () => {
    setVisible(false);
    resetDate();
    setCurrentTitle({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCurrentDescription({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCurrentAddress({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCurrentDuration({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCurrentStartDate({
      error: false,
      valid: false,
      message: '',
    });
  };

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getEventStyles(theme);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View style={eventStyles.formContainer}>
        <ScrollView>
          <View style={eventStyles.textInputContainer}> 
            <List.Subheader> Informations </List.Subheader>
            <TextInput
              ref={titleInput}
              label="Titre"
              value={currentTitle.value}
              error={currentTitle.error}
              keyboardType="default"
              disableFullscreenUI
              onSubmitEditing={({ nativeEvent }) => {
                validateTitleInput(nativeEvent.text);
                descriptionInput.current?.focus();
              }}
              onEndEditing={({ nativeEvent }) => {
                validateTitleInput(nativeEvent.text);
              }}
              autoFocus
              theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
              mode="outlined"
              style={eventStyles.textInput}
              onChangeText={(text) => {
                setTitle({ value: text });
                preValidateTitleInput(text);
              }}
            />
          </View>
          {currentTitle.error && (
            <HelperText type="error" style={{ marginBottom: 10, marginTop: -5 }}>
              {currentTitle.message}
            </HelperText>
          )}
          <View style={eventStyles.textInputContainer}>
            <TextInput
              ref={descriptionInput}
              label="Description (facultatif)"
              value={currentDescription.value}
              error={currentDescription.error}
              disableFullscreenUI
              onSubmitEditing={({ nativeEvent }) => {
                validateDescriptionInput(nativeEvent.text);
                addressInput.current?.focus();
              }}
              theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
              mode="outlined"
              style={eventStyles.textInput}
              onEndEditing={({ nativeEvent }) => {
                validateDescriptionInput(nativeEvent.text);
              }}
              onChangeText={(text) => {
                setDescription({ value: text });
                preValidateDescriptionInput(text);
              }}
            />
          {currentDescription.error && (
            <HelperText type="error" style={{ marginBottom: 10, marginTop: -5 }}>
              {currentDescription.message}
            </HelperText>
          )}
          </View>
          <View style={eventStyles.textInputContainer}>
            <TextInput
              ref={addressInput}
              label="Lieu (facultatif)"
              value={currentAddress.value}
              error={currentAddress.error}
              disableFullscreenUI
              onSubmitEditing={() => {
                blurInputs();
              }}
              autoCorrect={false}
              theme={{colors: { primary: colors.primary, placeholder: colors.valid }}}
              mode="outlined"
              style={eventStyles.textInput}
              onChangeText={(text) => {
                setAddress({ value: text });
              }}
            />
          </View>
          <View style={{ height: 10 }} />
          <List.Subheader> Début </List.Subheader>
          <View style={eventStyles.textInputContainer}>
            <Button
                mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                uppercase={Platform.OS !== 'ios'}
                style={{ flex: 1, marginRight: 5 }}
                onPress={() => {
                  setVisible(false);
                  setStartDate({
                    error: false,
                    valid: true,
                  });
                  setDate();
                }}
            >
                {date.valueOf() === jan1970.valueOf() ? 'Horaire de début' : moment(date).format('LLL')}
            </Button>
          </View>
          {currentStartDate.error && (
            <HelperText type="error" style={{ marginBottom: 10, marginTop: -5 }}>
              {currentStartDate.message}
            </HelperText>
          )}
          <View style={{ height: 20 }} />
          <View style={eventStyles.textInputContainer}>
            <List.Subheader> Durée </List.Subheader>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                ref={durationInput}
                value={currentDuration.value}
                error={currentDuration.error}
                disableFullscreenUI
                onSubmitEditing={() => {
                  blurInputs();
                  checkDuration();
                }}
                autoCorrect={false}
                theme={{colors: { primary: colors.primary, placeholder: colors.valid }}}
                mode="flat"
                keyboardType="number-pad"
                style={{width: 160, height: 50}}
                onChangeText={(text) => {
                  setDuration({ value: text });
                }}
              />
              <Menu
                  visible={isMenuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Button
                      onPress={() => setMenuVisible(true)}
                      mode= "outlined"
                      style={{width: 160, height: 50, padding: 10, zIndex: 100000}}
                    >
                      {durationType === 'minutes' ? 'minutes' : durationType === 'hours' ? 'heures' : 'jours'}
                    </Button>
                  }>
                <Menu.Item onPress={() => {setDurationType('minutes');}} title="minutes" />
                <Menu.Item onPress={() => {setDurationType('hours');}} title="heures" />
                <Menu.Item onPress={() => {setDurationType('days');}} title="jours" />
              </Menu>
            </View>
            {currentDuration.error && (
            <HelperText type="error" style={{ marginBottom: 10, marginTop: -5 }}>
              {currentDuration.message}
            </HelperText>
          )}
          </View>
        </ScrollView>
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
            Annuler
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
            Ajouter
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { eventData } = state;
  return {
    creationData: eventData.creationData,
  };
};

export default connect(mapStateToProps)(ProgramAddModal);