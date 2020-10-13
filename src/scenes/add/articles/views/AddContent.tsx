import React from 'react';
import { connect } from 'react-redux';

import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import {
  Text,
  ProgressBar,
  useTheme,
  Button,
  HelperText,
  Title,
  Divider,
} from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

import { State, ArticleRequestState, ArticleCreationData } from '@ts/types';
import {
  TranslucentStatusBar,
  StepperView,
  ErrorMessage,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import { articleAdd } from '@redux/actions/apiActions/articles';
import getStyles from '@styles/Styles';
import {
  clearArticleCreationData,
  updateArticleCreationData,
} from '@redux/actions/contentData/articles';
import { RichToolbar, RichEditor, actions } from 'react-native-pell-rich-editor';

import type { ArticleStackParams } from '../index';
import getArticleStyles from '../styles/Styles';
import ArticleAddPageGroup from '../components/AddGroup';
import ArticleAddPageLocation from '../components/AddLocation';
import ArticleAddPageMeta from '../components/AddMeta';
import ArticleAddPageContent from '../components/AddContent';
import ArticleAddPageTags from '../components/AddTags';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinkAddModal from '../components/LinkAddModal';
import TurndownService from 'turndown';

type Props = {
  navigation: StackNavigationProp<ArticleStackParams, 'Add'>;
  reqState: ArticleRequestState;
  creationData?: ArticleCreationData;
};

const ArticleAddContent: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const { colors } = theme;

  const add = (parser?: 'markdown' | 'plaintext', data?: string) => {
    articleAdd({
      title: creationData.title,
      summary: creationData.summary,
      date: Date.now(),
      location: creationData.location,
      group: creationData.group,
      image: null,
      parser: parser || creationData.parser,
      data: data || creationData.data,
      tags: creationData.tags,
      preferences: null,
    }).then(({ _id }) => {
      navigation.replace('Success', { id: _id, creationData });
      clearArticleCreationData();
    });
  };

  const [toolbarInitialized, setToolbarInitialized] = React.useState(false);
  const [valid, setValid] = React.useState(true);

  let textEditor = React.useRef<RichEditor>(null);

  const setTextEditor = (e: any) => (textEditor = e);

  const icon = (icon: string) => {
    return ({
      disabled,
      iconSize,
      selected,
    }: {
      disabled: boolean;
      iconSize: number;
      selected: boolean;
    }) => (
      <Icon
        name={icon}
        color={disabled ? colors.disabled : selected ? colors.primary : colors.text}
        size={iconSize / 2}
      />
    );
  };

  const submit = async () => {
    const contentVal = await textEditor?.getContentHtml();

    const turndownService = new TurndownService();

    // No idea why, this fails with "undefined is not a function" even though turndown is a function (see with console.log)
    const contentMarkdown = turndownService.turndown(contentVal);

    const contentValid = contentMarkdown?.length && contentMarkdown?.length > 0;
    if (contentValid) {
      updateArticleCreationData({ parser: 'markdown', data: contentMarkdown });
      add('markdown', contentVal);
    } else {
      setValid(false);
    }
  };

  const [linkAddModalVisible, setLinkAddModalVisible] = React.useState(false);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        {reqState.add?.loading ? <ProgressBar indeterminate /> : <View style={{ height: 4 }} />}
        {reqState.add?.success === false && (
          <ErrorMessage
            error={reqState.add?.error}
            strings={{
              what: "l'ajout de l'article",
              contentSingular: "L'article",
            }}
            type="axios"
            retry={add}
          />
        )}
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <View style={{ flexDirection: 'row' }}>
            <PlatformBackButton
              onPress={() => {
                Alert.alert(
                  'Quitter cet article?',
                  'Il sera sauvegardé comme un brouillon',
                  [
                    {
                      text: 'Quitter',
                      onPress: navigation.goBack,
                    },
                    {
                      text: 'Annuler',
                    },
                  ],
                  { cancelable: true },
                );
              }}
            />
            <View style={styles.container}>
              <Title numberOfLines={1}>{creationData?.title}</Title>
            </View>
          </View>
          <Divider />
          <View style={articleStyles.formContainer}>
            <View style={articleStyles.textInputContainer}>
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
        </ScrollView>
        <View style={{ backgroundColor: colors.surface }}>
          {toolbarInitialized && (
            <RichToolbar
              getEditor={() => textEditor}
              actions={[
                'insertImage',
                'insertLink',
                'bold',
                'italic',
                'strikeThrough',
                'orderedList',
                'unorderedList',
                'heading1',
                'heading2',
                'heading3',
                'SET_PARAGRAPH',
              ]}
              style={{ backgroundColor: colors.surface, marginHorizontal: 20 }}
              iconMap={{
                heading1: icon('format-header-1'),
                heading2: icon('format-header-2'),
                heading3: icon('format-header-3'),
                bold: icon('format-bold'),
                italic: icon('format-italic'),
                strikeThrough: icon('format-strikethrough'),
                unorderedList: icon('format-list-bulleted'),
                orderedList: icon('format-list-numbered'),
                insertImage: icon('image-outline'),
                insertLink: icon('link'),
                SET_PARAGRAPH: icon('format-clear'),
              }}
              insertLink={() => {
                setLinkAddModalVisible(true);
              }}
            />
          )}
          {!valid && (
            <HelperText type="error" visible={!valid}>
              Veuillez ajouter un contenu
            </HelperText>
          )}
          <View style={[styles.container, { flexDirection: 'row' }]}>
            <Button
              mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
              uppercase={Platform.OS !== 'ios'}
              loading={reqState.add?.loading}
              onPress={() => {
                textEditor?.blurContentEditor();
                submit();
              }}
              style={{ flex: 1, marginLeft: 5 }}
            >
              Publier
            </Button>
          </View>
        </View>
      </SafeAreaView>
      <LinkAddModal
        visible={linkAddModalVisible}
        setVisible={setLinkAddModalVisible}
        add={(link, name) => {
          setLinkAddModalVisible(false);
          textEditor?.insertLink(name, link);
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, articleData } = state;
  return { creationData: articleData.creationData, reqState: articles.state };
};

export default connect(mapStateToProps)(ArticleAddContent);
