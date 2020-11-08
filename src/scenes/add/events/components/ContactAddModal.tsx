import React from 'react';
import { Button, HelperText, TextInput, Card, ThemeProvider, useTheme } from 'react-native-paper';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Modal, TabChipList } from '@components/index';

import { ModalProps, State, EventPlace } from '@ts/types';
import getStyles from '@styles/Styles';

import getEventStyles from '../styles/Styles';

type ContactAddModalProps = ModalProps & {
  add: (contact: CustomContactType) => void;
};

type CustomContactType = {
  _id: string;
  key: string;
  value: string;
  link?: string;
};

const ContactAddModal: React.FC<ContactAddModalProps> = ({ visible, setVisible, add }) => {
  const keyInput = React.createRef<RNTestInput>();
  const valueInput = React.createRef<RNTestInput>();
  const linkInput = React.createRef<RNTestInput>();

  const predefinedSocials = [
    {
      key: 'none',
      title: 'Personnalisé',
    },
    {
      key: 'instagram',
      title: 'Instagram',
      link: 'https://instagram.com/%s',
    },
    {
      key: 'twitter',
      title: 'Twitter',
      link: 'https://twitter.com/%s',
    },
    {
      key: 'facebook',
      title: 'Facebook',
      link: 'https://facebook.com/%s',
    },
    {
      key: 'subreddit',
      title: 'Subreddit',
      link: 'https://reddit.com/s/%s',
    },
  ];

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempKey: InputStateType;
  let tempValue: InputStateType;
  let tempLink: InputStateType;

  const [predefinedType, setPredefinedType] = React.useState<string | null>(null);

  const [currentKey, setCurrentKey] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentValue, setCurrentValue] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });
  const [currentLink, setCurrentLink] = React.useState({
    value: '',
    error: false,
    valid: true,
    message: '',
  });

  function setKey(data: Partial<InputStateType>) {
    tempKey = { ...currentKey, ...(tempKey ?? {}), ...data };
    setCurrentKey(tempKey);
  }
  function setLink(data: Partial<InputStateType>) {
    // Because async setState
    tempLink = { ...currentLink, ...(tempLink ?? {}), ...data };
    setCurrentLink(tempLink);
  }
  function setValue(data: Partial<InputStateType>) {
    tempValue = { ...currentValue, ...(tempValue ?? {}), ...data };
    setCurrentValue(tempValue);
  }

  function blurInputs() {
    keyInput.current?.blur();
    valueInput.current?.blur();
    linkInput.current?.blur();
  }

  const validateLinkInput = (city: string) => {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (currentLink.value) {
      if (
        !currentLink.value.match(
          /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
        )
      ) {
        validation = {
          valid: false,
          error: true,
          message: 'Lien invalide',
        };
      } else {
        validation = { valid: true, error: false };
      }
    }
    setLink(validation);
  };

  {
    /*
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
*/
  }

  const submit = () => {
    const keyVal = currentKey.value;
    const valueVal = currentValue.value;
    const linkVal = currentLink.value;
    if (!keyVal && !predefinedType) {
      setKey({
        valid: false,
        error: true,
        message: 'Titre requis',
      });
    } else if (!valueVal) {
      setValue({
        valid: false,
        error: true,
        message: 'Valeur requise',
      });
    } else {
      if (predefinedType) {
        add({
          _id: shortid(),
          key: predefinedSocials.find((p) => p.key === predefinedType)?.key || 'Inconnu',
          value: valueVal,
          link: predefinedSocials
            .find((p) => p.key === predefinedType)
            ?.link?.replace('%s', valueVal),
        });
      } else {
        add({
          _id: shortid(),
          key: keyVal,
          value: valueVal,
          link: linkVal,
        });
      }
      setVisible(false);
      setCurrentKey({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentValue({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
      setCurrentLink({
        value: '',
        error: false,
        valid: false,
        message: '',
      });
    }
  };

  const cancel = () => {
    setVisible(false);
    setCurrentKey({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCurrentValue({
      value: '',
      error: false,
      valid: false,
      message: '',
    });
    setCurrentLink({
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
      <TabChipList
        sections={[{ key: 'main', data: predefinedSocials }]}
        selected={predefinedType || 'none'}
        setSelected={(val) => (val !== 'none' ? setPredefinedType(val) : setPredefinedType(null))}
      />
      <View style={eventStyles.formContainer}>
        {!predefinedType && (
          <View style={eventStyles.textInputContainer}>
            <TextInput
              ref={keyInput}
              label="Titre"
              value={currentKey.value}
              error={currentKey.error}
              keyboardType="default"
              disableFullscreenUI
              onSubmitEditing={() => {
                valueInput.current?.focus();
              }}
              autoFocus
              theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
              mode="outlined"
              style={eventStyles.textInput}
              onChangeText={(text) => {
                setKey({ value: text });
              }}
            />
          </View>
        )}
        {currentKey.error && (
          <HelperText type="error" style={{ marginBottom: 10, marginTop: -5 }}>
            {currentKey.message}
          </HelperText>
        )}
        <View style={eventStyles.textInputContainer}>
          <TextInput
            ref={valueInput}
            label={predefinedType ? "Nom d'utilisateur" : 'Valeur'}
            value={currentValue.value}
            error={currentValue.error}
            disableFullscreenUI
            onSubmitEditing={() => {
              linkInput.current?.focus();
            }}
            theme={{ colors: { primary: colors.primary, placeholder: colors.valid } }}
            mode="outlined"
            style={eventStyles.textInput}
            onChangeText={(text) => {
              setValue({ value: text });
            }}
          />
        </View>
        {!predefinedType && (
          <View style={eventStyles.textInputContainer}>
            <TextInput
              ref={linkInput}
              label="Lien (facultatif)"
              value={currentLink.value}
              error={currentLink.error}
              disableFullscreenUI
              onSubmitEditing={({ nativeEvent }) => {
                validateLinkInput(nativeEvent.text);
                blurInputs();
              }}
              autoCorrect={false}
              theme={
                currentLink.valid
                  ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                  : theme
              }
              mode="outlined"
              style={eventStyles.textInput}
              onEndEditing={({ nativeEvent }) => {
                validateLinkInput(nativeEvent.text);
              }}
              onChangeText={(text) => {
                setLink({ value: text });
              }}
            />
            <HelperText type="error" visible={currentLink.error} style={{ marginTop: -5 }}>
              {currentLink.message}
            </HelperText>
          </View>
        )}
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

export default connect(mapStateToProps)(ContactAddModal);
