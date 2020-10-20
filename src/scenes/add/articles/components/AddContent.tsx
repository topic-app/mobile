import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { TextInput, HelperText, Button, useTheme } from 'react-native-paper';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

import { request } from '@utils/index';
import { StepperViewPageProps } from '@components/index';
import {
  updateArticleCreationData,
  clearArticleCreationData,
} from '@redux/actions/contentData/articles';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & {
  add: Function;
  setToolbarInitialized: (b: boolean) => void;
  setTextEditor: (a: any) => void;
};

const ArticleAddPageGeneral: React.FC<Props> = ({
  prev,
  add,
  setToolbarInitialized,
  setTextEditor,
}) => {
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
      updateArticleCreationData({ parser: 'markdown', data: contentVal });
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
        <View style={{ marginTop: 20 }}>
          <RichEditor
            ref={setTextEditor}
            editorStyle={{
              backgroundColor: colors.background,
              color: colors.text,
              placeholderColor: colors.disabled,
            }}
            placeholder="Écrivez votre article"
            editorInitializedCallback={() => setToolbarInitialized(true)}
          />
        </View>
      </View>
    </View>
  );
};

export default ArticleAddPageGeneral;
