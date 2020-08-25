import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, HelperText, Button, useTheme } from 'react-native-paper';

import { request } from '@utils/index';
import { StepperViewPageProps } from '@components/index';
import { updateEventCreationData, clearEventCreationData } from '@redux/actions/contentData/events';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & { add: Function };

const EventAddPageGeneral: React.FC<Props> = ({ prev, add }) => {
  const contentInput = createRef<RNTestInput>();

  type InputStateType = {
    value: string;
    error: boolean;
    valid: boolean;
    message: string;
  };

  let tempContent: InputStateType;

  const [currentContent, setCurrentContent] = useState({
    value: '',
    error: false,
    valid: false,
    message: '',
  });

  function setContent(data: Partial<InputStateType>) {
    // Because async setState
    tempContent = { ...currentContent, ...(tempContent ?? {}), ...data };
    setCurrentContent(tempContent);
  }

  async function validateContentInput(content: string) {
    let validation: Partial<InputStateType> = { valid: false, error: false };

    if (content !== '') {
      if (content.length < 100) {
        validation = {
          valid: false,
          error: true,
          message: 'Le contenu doit contenir au moins 100 caractères',
        };
      } else {
        validation = { valid: true, error: false };
      }
    }
    setContent(validation);
    return validation;
  }

  function preValidateContentInput(content: string) {
    if (content.length >= 100) {
      setContent({ valid: false, error: false });
    }
  }

  function blurInputs() {
    contentInput.current?.blur();
  }

  async function submit() {
    const contentVal = currentContent.value;

    const content = await validateContentInput(contentVal);
    if (content.valid) {
      updateEventCreationData({ parser: 'markdown', data: contentVal });
      add('markdown', contentVal);
    } else {
      if (!content.valid && !content.error) {
        setContent({
          valid: false,
          error: true,
          message: 'Contenu requis',
        });
      }
    }
  }

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  return (
    <View style={authStyles.formContainer}>
      <View style={authStyles.textInputContainer}>
        <TextInput
          ref={contentInput}
          label="Écrivez votre évènement..."
          multiline
          numberOfLines={4}
          value={currentContent.value}
          error={currentContent.error}
          disableFullscreenUI
          autoCapitalize="none"
          onSubmitEditing={({ nativeEvent }) => {
            validateContentInput(nativeEvent.text);
            blurInputs();
            submit();
          }}
          autoCorrect={false}
          theme={
            currentContent.valid
              ? { colors: { primary: colors.primary, placeholder: colors.valid } }
              : theme
          }
          mode="outlined"
          onEndEditing={({ nativeEvent }) => {
            validateContentInput(nativeEvent.text);
          }}
          style={authStyles.textInput}
          onChangeText={(text) => {
            setContent({ value: text });
            preValidateContentInput(text);
          }}
        />
        <HelperText type="error" visible={currentContent.error}>
          {currentContent.message}
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
          Publier
        </Button>
      </View>
    </View>
  );
};

export default EventAddPageGeneral;
