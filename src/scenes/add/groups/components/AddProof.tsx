import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, HelperText, Button, ProgressBar, Checkbox, List } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { StepperViewPageProps, ErrorMessage } from '@components/index';
import { groupAdd } from '@redux/actions/apiActions/groups';
import { clearGroupCreationData } from '@redux/actions/contentData/groups';
import { State, GroupRequestState, GroupCreationData } from '@ts/types';
import { useTheme } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  creationData: GroupCreationData;
  state: GroupRequestState;
  navigation: any;
};

const ArticleAddPageProof: React.FC<Props> = ({ next, prev, creationData, state, navigation }) => {
  const nameInput = createRef<RNTestInput>();
  const shortNameInput = createRef<RNTestInput>();
  const descriptionInput = createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempName: InputStateType;
  let tempShortName: InputStateType;
  let tempDescription: InputStateType;

  const [currentName, setCurrentName] = useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [currentShortName, setCurrentShortName] = useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [currentDescription, setCurrentDescription] = useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });
  const [selectedID, setSelectedID] = React.useState('RNA');
  const [terms, setTerms] = React.useState(false);
  const [termsError, setTermsError] = React.useState(false);
  const [identity, setIdentity] = React.useState(false);
  const [identityError, setIdentityError] = React.useState(false);

  function setName(data: Partial<InputStateType>) {
    // Because async setState
    tempName = { ...currentName, ...(tempName ?? {}), ...data };
    setCurrentName(tempName);
  }
  function setShortName(data: Partial<InputStateType>) {
    tempShortName = { ...currentShortName, ...(tempShortName ?? {}), ...data };
    setCurrentShortName(tempShortName);
  }
  function setDescription(data: Partial<InputStateType>) {
    tempDescription = { ...currentDescription, ...(tempDescription ?? {}), ...data };
    setCurrentDescription(tempDescription);
  }

  async function validateNameInput(name: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (name !== '') {
      if (name.length <= 2) {
        validation = {
          valid: false,
          error: true,
          message: 'Votre nom doit contenir au moins 3 caractères.',
        };
      } else {
        validation = { valid: true, error: false };
      }
    }
    setName(validation);
    return validation;
  }

  function preValidateNameInput(name: string) {
    if (name.length >= 10 && name.length <= 100) {
      setName({ valid: false, error: false });
    }
  }

  async function validateShortNameInput(name: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (name !== '') {
      if (name.length <= 1) {
        validation = {
          valid: false,
          error: true,
          message: "L'acronyme doit contenir au moins 2 caractères.",
        };
      } else if (name.length >= 15) {
        validation = {
          valid: false,
          error: true,
          message: "L'acronyme doit contenir moins de 15 caractères.",
        };
      } else {
        validation = { valid: true, error: false };
      }
    } else {
      validation = {
        valid: true,
        error: false,
        message: '',
      };
    }
    setShortName(validation);
    return validation;
  }

  function preValidateShortNameInput(name: string) {
    if (name.length >= 1 && name.length <= 15) {
      setShortName({ valid: false, error: false });
    }
  }

  function blurInputs() {
    nameInput.current?.blur();
    shortNameInput.current?.blur();
    descriptionInput.current?.blur();
  }

  async function submit() {
    const nameVal = currentName.value;
    const shortNameVal = currentShortName.value;
    const descriptionVal = currentDescription.value;

    const name = await validateNameInput(nameVal);
    const shortName = await validateShortNameInput(shortNameVal);
    if (name.valid && shortName.valid && terms && identity) {
      groupAdd({
        name: creationData.name,
        shortName: creationData.shortName,
        summary: creationData.summary,
        location: creationData.location,
        type: creationData.type,
        parser: 'markdown',
        description: creationData.description,
        verification: {
          name: nameVal,
          id: `${selectedID}: ${shortNameVal}`,
          extra: descriptionVal,
        },
      }).then(({ _id }) => {
        navigation.replace('Success', { id: _id, creationData });
        clearGroupCreationData();
      });
    } else {
      if (!name.valid && !name.error) {
        setName({
          valid: false,
          error: true,
          message: 'Nom complet requis',
        });
      } else if (!terms) {
        setTermsError(true);
      } else if (!identity) {
        setIdentityError(true);
      }
    }
  }

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getArticleStyles(theme);

  return (
    <View style={articleStyles.formContainer}>
      {state.add?.loading ? <ProgressBar indeterminate /> : <View style={{ height: 4 }} />}
      {state.add?.success === false && (
        <ErrorMessage
          error={state.add?.error}
          strings={{
            what: "l'ajout du groupe",
            contentSingular: 'Le groupe',
            contentPlural: 'de groupes (5 maximum)',
          }}
          type="axios"
          retry={submit}
        />
      )}
      <View style={articleStyles.textInputContainer}>
        <TextInput
          ref={nameInput}
          label="Votre nom complet"
          value={currentName.value}
          error={currentName.error}
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateNameInput(nativeEvent.text);
            shortNameInput.current?.focus();
          }}
          autoFocus
          theme={
            currentName.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateNameInput(nativeEvent.text);
          }}
          style={articleStyles.textInput}
          onChangeText={(text) => {
            setName({ value: text });
            preValidateNameInput(text);
          }}
        />
        <HelperText type={currentName.error ? 'error' : 'info'} visible>
          {currentName.error
            ? currentName.message
            : "Donnez votre prénom et votre nom en entier, tel qu'il apparaît sur les documents légaux. En cas de contestation ou de doute sur votre identité, nous pourrons vous demander une pièce d'identité. Ce nom ne sera pas public mais sera retenu jusqu'à la suppression du groupe et ne pourra être modifié."}
        </HelperText>
      </View>
      <View style={articleStyles.textInputContainer}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <RNPickerSelect
              placeholder={{}}
              onValueChange={(val) => setSelectedID(val)}
              items={[
                { label: 'RNA', value: 'RNA' },
                { label: 'SIRET', value: 'SIRET' },
                { label: 'DUNS', value: 'DUNS' },
              ]}
              value={selectedID}
            >
              <Button
                mode="outlined"
                color={colors.text}
                style={{ marginTop: 5, height: 60, borderWidth: 1, justifyContent: 'center' }}
              >
                {selectedID} <Icon name="menu-down" size={20} color={colors.text} />
              </Button>
            </RNPickerSelect>
          </View>
          <View style={{ flex: 1, marginLeft: 20 }}>
            <TextInput
              ref={shortNameInput}
              label="Numéro d'identification (facultatif)"
              value={currentShortName.value}
              error={currentShortName.error}
              disableFullscreenUI
              onSubmitEditing={({ nativeEvent }) => {
                validateShortNameInput(nativeEvent.text);
                descriptionInput.current?.focus();
              }}
              theme={
                currentShortName.valid
                  ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                  : theme
              }
              mode="outlined"
              onEndEditing={({ nativeEvent }) => {
                validateShortNameInput(nativeEvent.text);
              }}
              style={articleStyles.textInput}
              onChangeText={(text) => {
                setShortName({ value: text });
                preValidateShortNameInput(text);
              }}
            />
          </View>
        </View>
        <HelperText type={currentShortName.error ? 'error' : 'info'} visible>
          {currentShortName.error
            ? currentShortName.message
            : "Vous pouvez fournir votre RNA, SIRET ou autre numéro d'identification. Celui-ci sera public."}
        </HelperText>
      </View>
      <View style={articleStyles.textInputContainer}>
        <TextInput
          ref={descriptionInput}
          label="Autres informations de vérification (facultatif)"
          multiline
          numberOfLines={8}
          value={currentDescription.value}
          error={currentDescription.error}
          disableFullscreenUI
          autoCapitalize="none"
          onSubmitEditing={({ nativeEvent }) => {
            blurInputs();
            submit();
          }}
          theme={
            currentDescription.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          style={articleStyles.textInput}
          onChangeText={(text) => {
            setDescription({ value: text });
          }}
        />
        <HelperText type="info" visible={descriptionInput.current?.isFocused()}>
          Si vous avez d&apos;autres éléments qui nous permettraient de confirmer votre identité,
          ajoutez les ici (par exemple : lien vers une publication au Journal Officiel, lien vers
          les mentions légales de votre organisation...) Ces informations ne seront pas publiques.
          En cas de doute, nous pourrons aussi vous demander plus d&apos;informations par mail.
        </HelperText>
      </View>
      <View style={articleStyles.textInputContainer}>
        <List.Item
          title="J'accepte la charte des administrateurs de groupes"
          titleNumberOfLines={10}
          left={() =>
            Platform.OS !== 'ios' ? (
              <Checkbox status={terms ? 'checked' : 'unchecked'} color={colors.primary} />
            ) : null
          }
          right={() =>
            Platform.OS === 'ios' ? (
              <Checkbox status={terms ? 'checked' : 'unchecked'} color={colors.primary} />
            ) : null
          }
          onPress={() => setTerms(!terms)}
        />
        <List.Item
          title="Je confirme que j'ai bien l'autorité pour créer ce groupe au nom de l'organisation et que toutes les informations données sont correctes"
          titleNumberOfLines={10}
          left={() =>
            Platform.OS !== 'ios' ? (
              <Checkbox status={identity ? 'checked' : 'unchecked'} color={colors.primary} />
            ) : null
          }
          right={() =>
            Platform.OS === 'ios' ? (
              <Checkbox status={identity ? 'checked' : 'unchecked'} color={colors.primary} />
            ) : null
          }
          onPress={() => setIdentity(!identity)}
        />
        <HelperText visible={termsError || identityError} type="error">
          Vous devez accepter la charte et la déclaration d&apos;autorité pour continuer
        </HelperText>
      </View>
      <View style={articleStyles.buttonContainer}>
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
          Créer
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groupData, groups } = state;
  return { creationData: groupData.creationData, state: groups.state };
};

export default connect(mapStateToProps)(ArticleAddPageProof);
