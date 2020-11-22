import React, { useState, createRef } from 'react';
import { View, Platform, TextInput as RNTestInput, Image } from 'react-native';
import { TextInput, HelperText, Button, ProgressBar, Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { StepperViewPageProps, CollapsibleView, ErrorMessage } from '@components/index';
import { upload } from '@redux/actions/apiActions/upload';
import { updateArticleCreationData } from '@redux/actions/contentData/articles';
import getStyles from '@styles/Styles';
import { State, ArticleCreationData, UploadRequestState, Account } from '@ts/types';
import { useTheme, logger, getImageUrl } from '@utils/index';

import getArticleStyles from '../styles/Styles';

type ArticleAddPageMetaProps = StepperViewPageProps & {
  creationData: ArticleCreationData;
  state: UploadRequestState;
  account: Account;
};

const ArticleAddPageMeta: React.FC<ArticleAddPageMetaProps> = ({
  next,
  prev,
  creationData,
  state,
  account,
}) => {
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
  const [currentFile, setCurrentFile] = React.useState<string | null>(null);

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
      if (description.length >= 500) {
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
      updateArticleCreationData({
        title: titleVal,
        summary: descriptionVal,
        image: { image: currentFile, thumbnails: { small: false, medium: true, large: true } },
      });
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

  const uploadImage = () =>
    upload(creationData.group || '').then((id: string) => {
      logger.debug(`Upload successful ${id}`);
      setCurrentFile(id);
    });

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getArticleStyles(theme);
  const styles = getStyles(theme);

  if (!account.loggedIn) return null;

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
          label="Résumé"
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
                currentDescription.value.length > 500 && currentDescription.value.length !== 0
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
      {account.permissions?.some(
        (p) => p.permission === 'content.upload' && p.group === creationData.group,
      ) ? (
        <View>
          {currentFile && !state.upload?.loading && (
            <View style={styles.container}>
              <Card style={{ minHeight: 100 }}>
                <Image
                  source={{
                    uri:
                      getImageUrl({
                        image: { image: currentFile, thumbnails: {} },
                        size: 'full',
                      }) || '',
                  }}
                  style={{ height: 250 }}
                  resizeMode="contain"
                />
              </Card>
            </View>
          )}
          <View style={[styles.container, { marginBottom: 30 }]}>
            {state.upload?.error && (
              <ErrorMessage
                error={state.upload?.error}
                strings={{
                  what: "l'upload de l'image",
                  contentSingular: "L'image",
                }}
                type="axios"
                retry={uploadImage}
              />
            )}
            {state.upload?.loading ? (
              <Card style={{ height: 50, flex: 1 }}>
                <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
                  <View>
                    <Icon name="image" size={24} color={colors.disabled} />
                  </View>
                  <View style={{ marginHorizontal: 10, flexGrow: 1 }}>
                    <ProgressBar indeterminate />
                  </View>
                </View>
              </Card>
            ) : (
              <View style={{ flexDirection: 'row' }}>
                <Button
                  mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                  uppercase={false}
                  onPress={uploadImage}
                  style={{ flex: 1, marginRight: 5 }}
                >
                  {currentFile ? "Remplacer l'image" : 'Séléctionner une image'}
                </Button>
                {currentFile ? (
                  <Button
                    mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                    uppercase={false}
                    onPress={() => setCurrentFile(null)}
                    style={{ flex: 1, marginLeft: 5 }}
                  >
                    Supprimer l'image
                  </Button>
                ) : null}
              </View>
            )}
          </View>
        </View>
      ) : (
        <Card style={{ height: 50, flex: 1, marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', margin: 10, alignItems: 'center' }}>
            <View>
              <Icon name="image" size={24} color={colors.disabled} />
            </View>
            <View style={{ marginHorizontal: 10, flexGrow: 1 }}>
              <Text>Vous n'avez pas l'autorisation d'ajouter des images pour ce groupe</Text>
            </View>
          </View>
        </Card>
      )}
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

const mapStateToProps = (state: State) => {
  const { upload, articleData, account } = state;
  return { state: upload.state, creationData: articleData.creationData, account };
};

export default connect(mapStateToProps)(ArticleAddPageMeta);
