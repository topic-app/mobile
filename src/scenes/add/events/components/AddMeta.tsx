import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, HelperText, Button, useTheme } from 'react-native-paper';

import { request } from '@utils/index';
import { StepperViewPageProps, CollapsibleView } from '@components/index';
import { updateEventCreationData } from '@redux/actions/contentData/events';

import getEventStyles from '../styles/Styles';

type Props = StepperViewPageProps;

const EventAddPageMeta: React.FC<Props> = ({ next, prev }) => {
  const titleInput = createRef<RNTestInput>();
  const summaryInput = createRef<RNTestInput>();
  const descriptionInput = createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempTitle: InputStateType;
  let tempSummary: InputStateType;
  let tempDescription: InputStateType;

  const [currentTitle, setCurrentTitle] = useState({
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

  function setTitle(data: Partial<InputStateType>) {
    // Because async setState
    tempTitle = { ...currentTitle, ...(tempTitle ?? {}), ...data };
    setCurrentTitle(tempTitle);
  }
  function setSummary(data: Partial<InputStateType>) {
    tempSummary = { ...currentSummary, ...(tempSummary ?? {}), ...data };
    setCurrentSummary(tempSummary);
  }
  function setDescription(data: Partial<InputStateType>) {
    // Because async setState
    tempDescription = { ...currentDescription, ...(tempDescription ?? {}), ...data };
    setCurrentDescription(tempDescription);
  }

  async function validateTitleInput(title: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (title !== '') {
      if (title.length <= 10) {
        validation = {
          valid: false,
          error: true,
          message: 'Le titre doit contenir au moins 10 caractères',
        };
      } else if (title.length >= 100) {
        validation = {
          valid: false,
          error: true,
          message: 'Le titre doit contenir moins de 100 caractères',
        };
      } else {
        validation = { valid: true, error: false };
      }
    }
    setTitle(validation);
    return validation;
  }

  function preValidateTitleInput(title: string) {
    if (title.length >= 10 && title.length <= 100) {
      setTitle({ valid: false, error: false });
    }
  }

  async function validateSummaryInput(summary: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (summary !== '') {
      if (summary.length <= 100) {
        validation = {
          valid: false,
          error: true,
          message: 'Le résumé doit contenir au moins 100 caractères.',
        };
      } else if (summary.length >= 500) {
        validation = {
          valid: false,
          error: true,
          message: 'Le résumé doit contenir moins de 500 caractères.',
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

  function preValidateSummaryInput(summary: string) {
    if (summary.length >= 100 && summary.length <= 500) {
      setSummary({ valid: false, error: false });
    }
  }

  async function validateDescriptionInput(description: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (description !== '') {
      if (description.length < 100) {
        validation = {
          valid: false,
          error: true,
          message: 'La description doit contenir au moins 100 caractères',
        };
      } else {
        validation = { valid: true, error: false };
      }
    }
    setDescription(validation);
    return validation;
  }

  function preValidateDescriptionInput(description: string) {
    if (description.length >= 100) {
      setDescription({ valid: false, error: false });
    }
  }


  function blurInputs() {
    titleInput.current?.blur();
    summaryInput.current?.blur();
  }

  async function submit() {
    const titleVal = currentTitle.value;
    const summaryVal = currentSummary.value;
    const descriptionVal = currentDescription.value;

    const title = await validateTitleInput(titleVal);
    const summary = await validateSummaryInput(summaryVal);
    const description = await validateDescriptionInput(descriptionVal);
    if (title.valid && summary.valid && description.valid) {
      updateEventCreationData({ title: titleVal, summary: summaryVal, description: descriptionVal });
      next();
    } else {
      if (!title.valid && !title.error) {
        setTitle({
          valid: false,
          error: true,
          message: 'Titre requis',
        });
      }
      if (!description.valid && !description.error) {
        setDescription({
          valid: false,
          error: true,
          message: 'Description requise',
        });
      }
    }
    }

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getEventStyles(theme);

  return (
    <View style={eventStyles.formContainer}>
      <View style={eventStyles.textInputContainer}>
        <TextInput
          ref={titleInput}
          label="Titre"
          value={currentTitle.value}
          error={currentTitle.error}
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateTitleInput(nativeEvent.text);
            summaryInput.current?.focus();
          }}
          autoCorrect={false}
          autoFocus
          theme={
            currentTitle.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateTitleInput(nativeEvent.text);
          }}
          style={eventStyles.textInput}
          onChangeText={(text) => {
            setTitle({ value: text });
            preValidateTitleInput(text);
          }}
        />
        <HelperText type="error" visible={currentTitle.error}>
          {currentTitle.message}
        </HelperText>
      </View>
      <View style={eventStyles.textInputContainer}>
        <TextInput
          ref={summaryInput}
          label="Résumé"
          multiline
          numberOfLines={4}
          value={currentSummary.value}
          error={currentSummary.error}
          disableFullscreenUI
          autoCapitalize="none"
          onSubmitEditing={({ nativeEvent }) => {
            validateSummaryInput(nativeEvent.text);
            blurInputs();
            submit();
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
          style={eventStyles.textInput}
          onChangeText={(text) => {
            setSummary({ value: text });
            preValidateSummaryInput(text);
          }}
        />
        <CollapsibleView collapsed={!currentSummary.error && !!currentSummary.value}>
          <HelperText type={currentSummary.value ? 'error' : 'info'} visible>
            {currentSummary.value
              ? currentSummary.message
              : 'Laissez vide pour sélectionner les premières lignes de la description'}
          </HelperText>
        </CollapsibleView>
        <CollapsibleView collapsed={!currentSummary.value}>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
            <HelperText
              type={
                (currentSummary.value.length < 100 || currentSummary.value.length > 500) &&
                currentSummary.value.length !== 0
                  ? 'error'
                  : 'info'
              }
            >
              {currentSummary.value.length}/500
            </HelperText>
          </View>
        </CollapsibleView>
        <View style={{ height: 20 }} />
      </View>
      <View style={eventStyles.textInputContainer}>
        <TextInput
          ref={descriptionInput}
          label="Décrivez votre évènement..."
          multiline
          numberOfLines={4}
          value={currentDescription.value}
          error={currentDescription.error}
          disableFullscreenUI
          autoCapitalize="none"
          onSubmitEditing={({ nativeEvent }) => {
            validateDescriptionInput(nativeEvent.text);
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
          onEndEditing={({ nativeEvent }) => {
            validateDescriptionInput(nativeEvent.text);
          }}
          style={eventStyles.textInput}
          onChangeText={(text) => {
            setDescription({ value: text });
            preValidateDescriptionInput(text);
          }}
        />
        <HelperText type="error" visible={currentDescription.error}>
          {currentDescription.message}
        </HelperText>
      </View>
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

export default EventAddPageMeta;
