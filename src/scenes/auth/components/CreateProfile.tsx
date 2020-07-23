import React from 'react';
import { View, Platform, FlatList, TextInput as RNTextInput } from 'react-native';
import { TextInput, HelperText, Button, Divider, useTheme } from 'react-native-paper';
import randomColor from 'randomcolor';
import shortid from 'shortid';

import { Avatar, CollapsibleView, StepperViewPageProps } from '@components/index';
import { updateCreationData } from '@redux/actions/data/account';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  username: string;
  accountType: 'public' | 'private';
};

const AuthCreatePageProfile: React.FC<Props> = ({
  next,
  prev,
  username = '',
  accountType = 'private',
}) => {
  const firstnameInput = React.createRef<RNTextInput>();
  const lastnameInput = React.createRef<RNTextInput>();
  const flatlistRef = React.createRef<FlatList>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  const [currentFirstname, setCurrentFirstname] = React.useState<InputStateType>({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  const [currentLastname, setCurrentLastname] = React.useState<InputStateType>({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  let tempFirstname: InputStateType;
  let tempLastname: InputStateType;

  function setFirstname(data: Partial<InputStateType>) {
    tempFirstname = { ...currentFirstname, ...(tempFirstname ?? {}), ...data };
    setCurrentFirstname(tempFirstname);
  }

  function setLastname(data: Partial<InputStateType>) {
    tempLastname = { ...currentLastname, ...(tempLastname ?? {}), ...data };
    setCurrentLastname(tempLastname);
  }

  const generateAvatars = () =>
    ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].map((i) => {
      return {
        key: shortid(),
        type: 'gradient',
        gradient: {
          start: randomColor({ hue: i }),
          end: randomColor(),
          angle: Math.floor(Math.random() * 90 + 1),
        },
      };
    });

  const [avatars, setAvatars] = React.useState(generateAvatars());

  const addAvatars = () => setAvatars([...avatars, ...generateAvatars()]);

  const [activeAvatar, setActiveAvatar] = React.useState(avatars[0]);

  const [avatarsVisible, setAvatarsVisible] = React.useState(false);

  function validateFirstnameInput(firstname: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };
    if (firstname !== '') {
      validation = { valid: true, error: false, message: '' };
    }

    setFirstname(validation);
    return validation;
  }

  function preValidateFirstnameInput(firstname: string) {
    if (firstname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      setFirstname({ valid: false, error: false });
    }
  }

  function validateLastnameInput(lastname: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };
    if (lastname !== '') {
      validation = { valid: true, error: false };
    }

    setLastname(validation);
    return validation;
  }

  function preValidateLastnameInput(lastname: string) {
    if (lastname.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i) !== null) {
      setLastname({ valid: true, error: false });
    }
  }

  function blurInputs() {
    firstnameInput.current?.blur();
    lastnameInput.current?.blur();
  }

  function submit() {
    const firstnameVal = currentFirstname.value;
    const lastnameVal = currentLastname.value;
    const firstname = validateFirstnameInput(firstnameVal);
    const lastname = validateLastnameInput(lastnameVal);
    if ((firstname.valid && lastname.valid) || accountType === 'private') {
      delete activeAvatar.key;
      updateCreationData({
        firstName: firstnameVal,
        lastName: lastnameVal,
        avatar: activeAvatar,
      });
      next();
    }
  }

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  return (
    <View>
      <View style={authStyles.mainAvatarContainer}>
        <View style={authStyles.centerAvatarContainer}>
          <Avatar
            size={100}
            onPress={() => setAvatarsVisible(!avatarsVisible)}
            avatar={{
              type: 'gradient',
              gradient: {
                start: activeAvatar.gradient.start,
                end: activeAvatar.gradient.end,
                angle: activeAvatar.gradient.angle,
              },
              text: username?.substring(0, 1) || '',
            }}
          />
        </View>
        <CollapsibleView collapsed={!avatarsVisible}>
          <Divider />
          <FlatList
            ref={flatlistRef}
            data={avatars}
            horizontal
            onEndReachedThreshold={0.5}
            onEndReached={addAvatars}
            renderItem={({ item }) => {
              return (
                <View
                  style={[
                    authStyles.avatarContainer,
                    item.key === activeAvatar.key
                      ? { backgroundColor: colors.primary }
                      : { borderRadius: 55 },
                  ]}
                >
                  <Avatar
                    size={100}
                    onPress={() => setActiveAvatar(item)}
                    avatar={{
                      type: 'gradient',
                      gradient: {
                        start: item.gradient.start,
                        end: item.gradient.end,
                        angle: item.gradient.angle,
                      },
                      text: username?.substring(0, 1) || '',
                    }}
                  />
                </View>
              );
            }}
          />
          <Divider />
        </CollapsibleView>
      </View>
      <View style={authStyles.formContainer}>
        <View style={authStyles.textInputContainer}>
          <TextInput
            disabled={accountType !== 'public'}
            ref={firstnameInput}
            label={
              accountType === 'public'
                ? 'Prénom (facultatif)'
                : 'Prénom (comptes publics uniquement)'
            }
            value={currentFirstname.value}
            error={currentFirstname.error}
            autoCompleteType="name"
            disableFullscreenUI
            onSubmitEditing={({ nativeEvent }) => {
              validateFirstnameInput(nativeEvent.text);
              lastnameInput.current?.focus();
            }}
            autoFocus
            theme={
              currentFirstname.valid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            mode="outlined"
            onEndEditing={({ nativeEvent }) => {
              validateFirstnameInput(nativeEvent.text);
            }}
            textContentType="givenName"
            style={authStyles.textInput}
            onChangeText={(text) => {
              setFirstname({ value: text });
              preValidateFirstnameInput(text);
            }}
          />
          <HelperText type="error" visible={currentFirstname.error}>
            {currentFirstname.message}
          </HelperText>
        </View>
        <View style={authStyles.textInputContainer}>
          <TextInput
            disabled={accountType !== 'public'}
            ref={lastnameInput}
            label={
              accountType === 'public' ? 'Nom (facultatif)' : 'Nom (comptes publics uniquement)'
            }
            value={currentLastname.value}
            error={currentLastname.error}
            autoCompleteType="email"
            disableFullscreenUI
            onSubmitEditing={({ nativeEvent }) => {
              validateLastnameInput(nativeEvent.text);
              blurInputs();
              submit();
            }}
            autoCorrect={false}
            theme={
              currentLastname.valid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            textContentType="emailAddress"
            mode="outlined"
            onEndEditing={({ nativeEvent }) => {
              validateLastnameInput(nativeEvent.text);
            }}
            style={authStyles.textInput}
            onChangeText={(text) => {
              setLastname({ value: text });
              preValidateLastnameInput(text);
            }}
          />
          <HelperText type="error" visible={currentLastname.error}>
            {currentLastname.message}
          </HelperText>
        </View>
        <View style={authStyles.buttonContainer}>
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
            onPress={() => {
              blurInputs();
              submit();
            }}
            style={{ flex: 1, marginLeft: 5 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AuthCreatePageProfile;
