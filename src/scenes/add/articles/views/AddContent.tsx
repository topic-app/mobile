import React from 'react';
import { View, ScrollView, Platform, Alert } from 'react-native';
import { ProgressBar, Button, HelperText, Title, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import {
  TranslucentStatusBar,
  ErrorMessage,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import { RichToolbar, RichEditor } from '@components/richEditor/index';
import { Config } from '@constants/index';
import { articleAdd } from '@redux/actions/apiActions/articles';
import { upload } from '@redux/actions/apiActions/upload';
import {
  clearArticleCreationData,
  updateArticleCreationData,
} from '@redux/actions/contentData/articles';
import getStyles from '@styles/Styles';
import { State, ArticleRequestState, ArticleCreationData, Account } from '@ts/types';
import { useTheme, logger } from '@utils/index';

import LinkAddModal from '../components/LinkAddModal';
import YoutubeAddModal from '../components/YoutubeAddModal';
import type { ArticleAddScreenNavigationProp } from '../index';
import getArticleStyles from '../styles/Styles';

type ArticleAddContentProps = {
  navigation: ArticleAddScreenNavigationProp<'AddContent'>;
  reqState: ArticleRequestState;
  creationData?: ArticleCreationData;
  account: Account;
};

const ArticleAddContent: React.FC<ArticleAddContentProps> = ({
  navigation,
  reqState,
  creationData = {},
  account,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const { colors } = theme;

  const add = (parser?: 'markdown' | 'plaintext', data?: string) => {
    const replacedData = (data || creationData.data)
      ?.replace(Config.google.youtubePlaceholder, 'youtube://')
      .replace(Config.cdn.baseUrl, 'cdn://');
    articleAdd({
      title: creationData.title,
      summary: creationData.summary,
      date: new Date(),
      location: creationData.location,
      group: creationData.group,
      image: creationData.image,
      parser: parser || creationData.parser,
      data: replacedData,
      tags: creationData.tags,
      preferences: {
        comments: true,
      },
    }).then(({ _id }) => {
      navigation.replace('Success', { id: _id, creationData });
      clearArticleCreationData();
    });
  };

  const [toolbarInitialized, setToolbarInitialized] = React.useState(false);
  const [valid, setValid] = React.useState(true);

  const [markdown, setMarkdown] = React.useState('');
  const [youtubeAddModalVisible, setYoutubeAddModalVisible] = React.useState(false);

  const [linkAddModalVisible, setLinkAddModalVisible] = React.useState(false);

  const textEditorRef = React.createRef<RichEditor>();

  if (!account.loggedIn) return null;

  const icon = (name: string) => {
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
        name={name}
        color={disabled ? colors.disabled : selected ? colors.primary : colors.text}
        size={iconSize / 2}
      />
    );
  };

  const submit = async () => {
    const contentValid = markdown?.length && markdown?.length > 0;
    if (contentValid) {
      updateArticleCreationData({ parser: 'markdown', data: markdown });
      add('markdown', markdown);
    } else {
      setValid(false);
    }
  };

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
                  'Supprimer cet article?',
                  'Vous ne pourrez plus y revenir.',
                  [
                    {
                      text: 'Annuler',
                    },
                    {
                      text: 'Quitter',
                      onPress: navigation.goBack,
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
                  onHeightChange={() => {}}
                  ref={textEditorRef}
                  onChangeMarkdown={(data: string) => setMarkdown(data)}
                  editorStyle={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    placeholderColor: colors.disabled,
                  }}
                  placeholder="Écrivez votre article"
                  editorInitializedCallback={() => {
                    logger.debug('Editor toolbar initialized');
                    setToolbarInitialized(true);
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={{ backgroundColor: colors.surface }}>
          {toolbarInitialized ? (
            <RichToolbar
              getEditor={() => textEditorRef.current!}
              actions={[
                ...(account.permissions?.some(
                  (p) => p.permission === 'content.upload' && p.group === creationData.group,
                )
                  ? ['insertImage']
                  : []),
                'insertLink',
                'insertYoutube',
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
                insertYoutube: icon('youtube'),
                insertLink: icon('link'),
                SET_PARAGRAPH: icon('format-clear'),
              }}
              insertLink={() => {
                setLinkAddModalVisible(true);
              }}
              insertImage={() =>
                upload(creationData.group || '').then((fileId: string) => {
                  textEditorRef.current?.insertImage(`${config.cdn.baseUrl}${fileId}`);
                })
              }
              insertYoutube={() => setYoutubeAddModalVisible(true)}
            />
          ) : null}
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
                textEditorRef.current?.blurContentEditor();
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
          textEditorRef.current?.insertLink(name, link);
        }}
      />
      <YoutubeAddModal
        visible={youtubeAddModalVisible}
        setVisible={setYoutubeAddModalVisible}
        add={(url) => {
          setLinkAddModalVisible(false);
          textEditorRef.current?.insertImage(url);
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, articleData, account } = state;
  return {
    creationData: articleData.creationData,
    reqState: articles.state,
    account,
  };
};

export default connect(mapStateToProps)(ArticleAddContent);
