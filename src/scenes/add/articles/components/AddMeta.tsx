import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, HelperText, Button, useTheme } from 'react-native-paper';

import { request } from '@utils/index';
import { StepperViewPageProps, CollapsibleView } from '@components/index';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';

import getArticleStyles from '../styles/Styles';

type Props = StepperViewPageProps;

const ArticleAddPageGeneral: React.FC<Props> = ({ next, prev }) => {
  const titleInput = createRef<RNTestInput>();
  const descriptionInput = createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempTitle: InputStateType;
  let tempDescription: InputStateType;

  const [currentTitle, setCurrentTitle] = useState({
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
  function setDescription(data: Partial<InputStateType>) {
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

  async function validateDescriptionInput(description: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (description !== '') {
      if (description.length <= 100) {
        validation = {
          valid: false,
          error: true,
          message: 'La description doit contenir au moins 100 caractères.',
        };
      } else if (description.length >= 500) {
        validation = {
          valid: false,
          error: true,
          message: 'La description doit contenir moins de 500 caractères.',
        };
      } else {
        validation = { valid: true, error: false };
      }
    } else {
      validation = { valid: true, error: false };
    }

    setDescription(validation);
    return validation;
  }

  function preValidateDescriptionInput(description: string) {
    if (description.length >= 100 && description.length <= 500) {
      // TODO: Change to descriptionExists once server is updated
      setDescription({ valid: false, error: false });
    }
  }

  function blurInputs() {
    titleInput.current?.blur();
    descriptionInput.current?.blur();
  }

  async function submit() {
    const titleVal = currentTitle.value;
    const descriptionVal = currentDescription.value;

    const title = await validateTitleInput(titleVal);
    const description = await validateDescriptionInput(descriptionVal);
    if (title.valid && description.valid) {
      updateArticleCreationData({ title: titleVal, summary: descriptionVal });
      next();
    } else {
      if (!title.valid && !title.error) {
        setTitle({
          valid: false,
          error: true,
          message: 'Titre requis',
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
          ref={titleInput}
          label="Titre"
          value={currentTitle.value}
          error={currentTitle.error}
          disableFullscreenUI
          onSubmitEditing={({ nativeEvent }) => {
            validateTitleInput(nativeEvent.text);
            descriptionInput.current?.focus();
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
          style={articleStyles.textInput}
          onChangeText={(text) => {
            setTitle({ value: text });
            preValidateTitleInput(text);
          }}
        />
        <HelperText type="error" visible={currentTitle.error}>
          {currentTitle.message}
        </HelperText>
      </View>
      <View style={articleStyles.textInputContainer}>
        <TextInput
          ref={descriptionInput}
          label="Description"
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
          style={articleStyles.textInput}
          onChangeText={(text) => {
            setDescription({ value: text });
            preValidateDescriptionInput(text);
          }}
        />
        <CollapsibleView collapsed={!currentDescription.error && !!currentDescription.value}>
          <HelperText type={currentDescription.value ? 'error' : 'info'} visible>
            {currentDescription.value
              ? currentDescription.message
              : "Laissez vide pour selectionner les premières lignes de l'article"}
          </HelperText>
        </CollapsibleView>
        <CollapsibleView collapsed={!currentDescription.value}>
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
            <HelperText
              type={
                (currentDescription.value.length < 100 || currentDescription.value.length > 500) &&
                currentDescription.value.length !== 0
                  ? 'error'
                  : 'info'
              }
            >
              {currentDescription.value.length}/500
            </HelperText>
          </View>
        </CollapsibleView>
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

export default ArticleAddPageGeneral;
