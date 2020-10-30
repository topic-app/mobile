import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, HelperText, Button, useTheme } from 'react-native-paper';

import { StepperViewPageProps, CollapsibleView } from '@components/index';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';

import getArticleStyles from '../styles/Styles';

type Props = StepperViewPageProps;

const ArticleAddPageMeta: React.FC<Props> = ({ next, prev }) => {
  const nameInput = createRef<RNTestInput>();
  const shortNameInput = createRef<RNTestInput>();
  const summaryInput = createRef<RNTestInput>();
  const descriptionInput = createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempName: InputStateType;
  let tempShortName: InputStateType;
  let tempSummary: InputStateType;
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
  const [currentSummary, setCurrentSummary] = useState({
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

  function setName(data: Partial<InputStateType>) {
    // Because async setState
    tempName = { ...currentName, ...(tempName ?? {}), ...data };
    setCurrentName(tempName);
  }
  function setShortName(data: Partial<InputStateType>) {
    tempShortName = { ...currentShortName, ...(tempShortName ?? {}), ...data };
    setCurrentShortName(tempShortName);
  }
  function setSummary(data: Partial<InputStateType>) {
    tempSummary = { ...currentSummary, ...(tempSummary ?? {}), ...data };
    setCurrentSummary(tempSummary);
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
          message:
            "Le nom du groupe doit contenir au moins 3 caractères. N'utilisez pas d'abbréviations ou de raccourcis.",
        };
      } else if (name.length >= 50) {
        validation = {
          valid: false,
          error: true,
          message: 'Le nom du groupe doit contenir moins de 50 caractères',
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
          message: "L'acronyme doit contenir au moins 2 caractères",
        };
      } else if (name.length >= 15) {
        validation = {
          valid: false,
          error: true,
          message: "L'acronyme doit contenir moins de 15 caractères",
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

  async function validateSummaryInput(summary: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (summary !== '') {
      if (summary.length >= 200) {
        validation = {
          valid: false,
          error: true,
          message: 'La description courte doit contenir moins de 200 caractères.',
        };
      } else {
        validation = { valid: true, error: false };
      }
    } else {
      validation = { valid: true, error: false };
    }

    setSummary(validation);
    return validation;
  }

  function preValidateSummaryInput(description: string) {
    if (description.length >= 100 && description.length <= 500) {
      setSummary({ valid: false, error: false });
    }
  }

  function blurInputs() {
    nameInput.current?.blur();
    shortNameInput.current?.blur();
    summaryInput.current?.blur();
    descriptionInput.current?.blur();
  }

  async function submit() {
    const nameVal = currentName.value;
    const shortNameVal = currentShortName.value;
    const summaryVal = currentSummary.value;
    const descriptionVal = currentDescription.value;

    const name = await validateNameInput(nameVal);
    const shortName = await validateShortNameInput(shortNameVal);
    const summary = await validateSummaryInput(summaryVal);
    if (name.valid && shortName.valid && summary.valid) {
      updateGroupCreationData({
        name: nameVal,
        shortName: shortNameVal,
        summary: summaryVal,
        description: descriptionVal,
      });
      next();
    } else {
      if (!name.valid && !name.error) {
        setName({
          valid: false,
          error: true,
          message: 'Nom du groupe requis',
        });
      }
    }
  }

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getArticleStyles(theme);

  return (
    <View style={articleStyles.formContainer}>
      <View style={articleStyles.textInputContainer}>
        <TextInput
          ref={nameInput}
          label="Nom du groupe"
          value={currentName.value}
          error={currentName.error}
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateNameInput(nativeEvent.text);
            shortNameInput.current?.focus();
          }}
          autoCorrect={false}
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
            : 'Donnez un nom reconnaissable à votre groupe, sans abbréviations ou acronymes. Pour des raisons de sécurité, vous devrez nous contacter pour changer le nom du groupe après sa création.'}
        </HelperText>
      </View>
      <View style={articleStyles.textInputContainer}>
        <TextInput
          ref={shortNameInput}
          label="Abbréviation (facultatif)"
          value={currentShortName.value}
          error={currentShortName.error}
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateShortNameInput(nativeEvent.text);
            summaryInput.current?.focus();
          }}
          autoCorrect={false}
          autoFocus
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
        <HelperText type={currentShortName.error ? 'error' : 'info'} visible>
          {currentShortName.error
            ? currentShortName.message
            : 'Si vous avez un acronyme ou une abbréviation reconnaissable, fournissez-la içi. Ce nom sera affiché en priorité, donc laissez le vide si vous préférez afficher le nom complet sur vos publications.'}
        </HelperText>
      </View>
      <View style={articleStyles.textInputContainer}>
        <TextInput
          ref={summaryInput}
          label="Description courte"
          multiline
          numberOfLines={2}
          value={currentSummary.value}
          error={currentSummary.error}
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateSummaryInput(nativeEvent.text);
            descriptionInput.current?.focus();
          }}
          autoCorrect={false}
          theme={
            currentSummary.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateSummaryInput(nativeEvent.text);
          }}
          style={articleStyles.textInput}
          onChangeText={(text) => {
            setSummary({ value: text });
            preValidateSummaryInput(text);
          }}
        />
        <HelperText type={currentSummary.error ? 'error' : 'info'} visible>
          {currentSummary.error
            ? currentSummary.message
            : 'Décrivez votre groupe en une ou deux phrases'}
        </HelperText>
        <CollapsibleView collapsed={!currentSummary.value}>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
            <HelperText
              type={
                currentSummary.value.length > 200 && currentSummary.value.length !== 0
                  ? 'error'
                  : 'info'
              }
            >
              {currentSummary.value.length}/200
            </HelperText>
          </View>
        </CollapsibleView>
      </View>
      <View style={articleStyles.textInputContainer}>
        <TextInput
          ref={descriptionInput}
          label="Description longue"
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
          autoCorrect={false}
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
          Cette description sera affichée sur votre page groupe, elle peut être aussi longue que
          vous le voulez
        </HelperText>
        <View style={{ height: 20 }} />
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
          Suivant
        </Button>
      </View>
    </View>
  );
};

export default ArticleAddPageMeta;
