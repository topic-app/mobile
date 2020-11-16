import React from 'react';
import { Button, HelperText, TextInput, Card, ThemeProvider, useTheme } from 'react-native-paper';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Modal, TabChipList } from '@components/index';

import { ModalProps, State, EventPlace, Duration, Address } from '@ts/types';
import getStyles from '@styles/Styles';

import getEventStyles from '../styles/Styles';


type ProgramAddModalProps = ModalProps & {
  add: (program: ProgramType) => void;
};

type ProgramType = {
  _id: string;
  title: string;
  duration: Duration,
  description?: {
    parser?: string;
    data: string;
  };
  address?: Address;
};

const ProgramAddModal: React.FC<ProgramAddModalProps> = ({ visible, setVisible, add }) => {
  const titleInput = React.createRef<RNTestInput>();
  const descriptionInput = React.createRef<RNTestInput>();
  const addressInput = React.createRef<RNTestInput>();


  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempTitle: InputStateType;
  let tempDescription: InputStateType;
  let tempAddress: InputStateType;


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

  function blurInputs() {
    titleInput.current?.blur();
    descriptionInput.current?.blur();
    addressInput.current?.blur();
  }


  const submit = () => {
    const titleVal = currentTitle.value;
    const descriptionVal = currentDescription.value;
    const addressVal = currentAddress.value;
    add({
      _id: shortid(),
      title: titleVal,
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
  };

  const cancel = () => {
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
  };

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getEventStyles(theme);
  const styles = getStyles(theme);

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View style={eventStyles.formContainer}>
          <View style={eventStyles.textInputContainer}>
            <TextInput
              ref={titleInput}
              label="Titre"
              value={currentTitle.value}
              error={currentTitle.error}
              keyboardType="default"
              disableFullscreenUI
              onSubmitEditing={() => {
                descriptionInput.current?.focus();
              }}
              autoFocus
              theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
              mode="outlined"
              style={eventStyles.textInput}
              onChangeText={(text) => {
                setTitle({ value: text });
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
            onSubmitEditing={() => {
              addressInput.current?.focus();
            }}
            theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
            mode="outlined"
            style={eventStyles.textInput}
            onChangeText={(text) => {
              setDescription({ value: text });
            }}
          />
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
