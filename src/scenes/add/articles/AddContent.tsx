import React from 'react';
import { View, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import {
  Button,
  HelperText,
  Title,
  Divider,
  IconButton,
  RadioButton,
  List,
  TextInput,
  Card,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { TranslucentStatusBar, PlatformBackButton, CollapsibleView, Content } from '@components';
import { RichToolbar, RichEditor } from '@components/richEditor';
import { Config } from '@constants';
import { articleAdd, articleModify } from '@redux/actions/apiActions/articles';
import { upload } from '@redux/actions/apiActions/upload';
import {
  clearArticleCreationData,
  updateArticleCreationData,
} from '@redux/actions/contentData/articles';
import { State, ArticleRequestState, ArticleCreationData, Account } from '@ts/types';
import { logger, checkPermission, Alert, Errors, trackEvent, Permissions } from '@utils';

import type { ArticleAddScreenNavigationProp } from '.';
import LinkAddModal from '../components/LinkAddModal';
import YoutubeAddModal from '../components/YoutubeAddModal';
import getStyles from './styles';

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

  const { colors } = theme;

  const add = (parser?: 'markdown' | 'plaintext', data?: string) => {
    const replacedData = data || creationData.data;

    if (!creationData.editing) {
      trackEvent('articleadd:add-request');
      articleAdd({
        title: creationData.title,
        summary: creationData.summary,
        date: new Date(),
        location: creationData.location,
        opinion: creationData.opinion,
        group: creationData.group,
        image: creationData.image,
        parser: parser || creationData.parser,
        data: replacedData,
        tags: creationData.tags,
        preferences: {
          comments: true,
        },
      })
        .then(({ _id }) => {
          trackEvent('articleadd:add-success');
          navigation.goBack();
          navigation.replace('Success', { id: _id, creationData });
          clearArticleCreationData();
        })
        .catch((error) => {
          Errors.showPopup({
            type: 'axios',
            what: "l'ajout de l'article",
            error,
            retry: () => add(parser, data),
          });
        });
    } else {
      trackEvent('articleadd:modify-request');
      articleModify({
        id: creationData.id,
        group: creationData.group,
        title: creationData.title,
        summary: creationData.summary,
        location: creationData.location,
        opinion: creationData.opinion,
        image: creationData.image,
        parser: parser || creationData.parser,
        data: replacedData,
        tags: creationData.tags,
      })
        .then(({ _id }) => {
          trackEvent('articleadd:modify-success');
          navigation.goBack();
          navigation.replace('Success', { id: _id, creationData, editing: true });
          clearArticleCreationData();
        })
        .catch((error) => {
          Errors.showPopup({
            type: 'axios',
            what: "la modification de l'article",
            error,
            retry: () => add(parser, data),
          });
        });
    }
  };

  const editorTypes: {
    name: string;
    description: string;
    type: 'plaintext' | 'source' | 'rich';
  }[] = [
    {
      type: 'rich',
      name: 'Éditeur complet',
      description: 'Avec options de formattage',
    },
    {
      type: 'source',
      name: 'Éditeur code source',
      description: 'Écrivez en markdown',
    },
    {
      type: 'plaintext',
      name: 'Éditeur simple',
      description: 'Sans options de formattage',
    },
  ];

  const [toolbarInitialized, setToolbarInitialized] = React.useState(false);
  const [valid, setValid] = React.useState(true);

  const [markdown, setMarkdown] = React.useState(creationData.data || '');
  const [editor, setEditor] = React.useState<'plaintext' | 'source' | 'rich'>(
    creationData.editing ? (creationData.parser === 'markdown' ? 'source' : 'plaintext') : 'rich',
  );
  const [youtubeAddModalVisible, setYoutubeAddModalVisible] = React.useState(false);

  const [linkAddModalVisible, setLinkAddModalVisible] = React.useState(false);

  const [menuVisible, setMenuVisible] = React.useState(false);

  const [viewing, setViewing] = React.useState(false);

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
    const contentValid = markdown.length && markdown.length > 0;
    if (contentValid) {
      updateArticleCreationData({ parser: 'markdown', data: markdown });
      add(editor === 'plaintext' ? 'plaintext' : 'markdown', markdown);
    } else {
      setValid(false);
    }
  };

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }} enabled={Platform.OS === 'ios'}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', flex: 1, alignContent: 'center' }}>
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
                <Title numberOfLines={1}>
                  {creationData?.editing ? 'Modification de ' : ''}
                  {creationData?.title}
                </Title>
              </View>
            </View>
            <View style={{ alignSelf: 'center', marginLeft: 40 }}>
              <IconButton
                onPress={() => {
                  if (!viewing) {
                    textEditorRef.current?.blurContentEditor();
                    Keyboard.dismiss();
                  }
                  setViewing(!viewing);
                }}
                icon={viewing ? 'pencil' : 'eye'}
                style={{ marginLeft: 5 }}
              />
            </View>
            <View style={[styles.container, { alignSelf: 'flex-end' }]}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                loading={creationData.editing ? reqState.modify?.loading : reqState.add?.loading}
                onPress={() => {
                  textEditorRef.current?.blurContentEditor();
                  submit();
                }}
                style={{ flex: 1 }}
              >
                Publier
              </Button>
            </View>
          </View>
          <Divider />
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            <View style={styles.formContainer}>
              <View style={styles.textInputContainer}>
                {viewing && (
                  <View>
                    <View style={{ marginBottom: 20 }}>
                      <Card
                        elevation={0}
                        style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
                      >
                        <View style={[styles.container, { flexDirection: 'row' }]}>
                          <Icon
                            name="information-outline"
                            style={{ alignSelf: 'center', marginRight: 10 }}
                            size={24}
                            color={colors.primary}
                          />
                          <Text style={{ color: colors.text, alignSelf: 'center', flex: 1 }}>
                            Ci-dessous, l&apos;article tel qu&apos;il s&apos;affichera après
                            l&apos;avoir publié.
                          </Text>
                        </View>
                      </Card>
                    </View>
                    <Content
                      parser={editor === 'plaintext' ? 'plaintext' : 'markdown'}
                      data={markdown}
                    />
                  </View>
                )}
                <View
                  style={{
                    marginTop: 20,
                    // HACK: RichEditor does not play well with being unmounted
                    height: viewing ? 0 : undefined,
                    opacity: viewing ? 0 : 1,
                  }}
                >
                  {editor === 'rich' && (
                    <RichEditor
                      onHeightChange={() => {}}
                      ref={textEditorRef}
                      onChangeMarkdown={(data: string) =>
                        setMarkdown(
                          data
                            .replace(
                              new RegExp(Config.google.youtubePlaceholder, 'g'),
                              'youtube://',
                            )
                            .replace(new RegExp(Config.cdn.baseUrl, 'g'), 'cdn://'),
                        )
                      }
                      editorStyle={{
                        backgroundColor: colors.background,
                        color: colors.text,
                        placeholderColor: colors.disabled,
                      }}
                      placeholder="Écrivez votre article"
                      editorInitializedCallback={() => {
                        logger.debug('Editor toolbar initialized');
                        trackEvent('articleadd:content-editor-loaded');
                        setToolbarInitialized(true);
                      }}
                    />
                  )}
                  {(editor === 'source' || editor === 'plaintext') && (
                    <TextInput
                      placeholder="Écrivez votre article"
                      multiline
                      numberOfLines={20}
                      mode="outlined"
                      value={markdown}
                      onChangeText={(data: string) => setMarkdown(data)}
                      style={styles.textInput}
                    />
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={{ backgroundColor: colors.surface }}>
            <CollapsibleView collapsed={!menuVisible}>
              <View>
                {editorTypes.map((i) => (
                  <List.Item
                    key={i.type}
                    title={i.name}
                    description={i.description}
                    onPress={() => {
                      trackEvent('editor:switch-editor', { props: { type: i.type } });
                      if (markdown) {
                        Alert.alert(
                          "Voulez-vous vraiment changer d'éditeur ?",
                          'Vous pourrez perdre le formattage, les images etc.',
                          [
                            { text: 'Annuler', onPress: () => setMenuVisible(false) },
                            {
                              text: 'Changer',
                              onPress: () => {
                                setEditor(i.type);
                                setMenuVisible(false);
                              },
                            },
                          ],
                          { cancelable: true },
                        );
                      } else {
                        setEditor(i.type);
                        setMenuVisible(false);
                      }
                    }}
                    left={() => (
                      <RadioButton
                        color={colors.primary}
                        value=""
                        status={editor === i.type ? 'checked' : 'unchecked'}
                      />
                    )}
                  />
                ))}
              </View>
            </CollapsibleView>
            <View
              style={{
                flexDirection: 'row',
                // HACK: RichToolbar does not play well with being unmounted
                height: viewing ? 0 : undefined,
                opacity: viewing ? 0 : 1,
              }}
            >
              <IconButton
                icon="cog"
                color={colors.text}
                onPress={() => setMenuVisible(!menuVisible)}
              />
              {toolbarInitialized && editor === 'rich' ? (
                <RichToolbar
                  getEditor={() => textEditorRef.current!}
                  actions={[
                    ...(checkPermission(
                      account,
                      {
                        permission: Permissions.CONTENT_UPLOAD,
                        scope: {},
                      },
                      creationData.group || '',
                    )
                      ? ['insertImage']
                      : []),
                    'insertLink',
                    'insertYoutube',
                    'bold',
                    'italic',
                    // 'strikeThrough',
                    'heading1',
                    'heading2',
                    'heading3',
                    'orderedList',
                    'unorderedList',
                    'SET_PARAGRAPH',
                  ]}
                  style={{ backgroundColor: colors.surface, marginHorizontal: 20 }}
                  iconMap={{
                    heading1: icon('format-header-1'),
                    heading2: icon('format-header-2'),
                    heading3: icon('format-header-3'),
                    bold: icon('format-bold'),
                    italic: icon('format-italic'),
                    // strikeThrough: icon('format-strikethrough'),
                    unorderedList: icon('format-list-bulleted'),
                    orderedList: icon('format-list-numbered'),
                    insertImage: icon('image-outline'),
                    insertYoutube: icon('youtube'),
                    insertLink: icon('link'),
                    SET_PARAGRAPH: icon('format-clear'),
                  }}
                  // RichEditor accepts props for custom actions
                  // @ts-expect-error
                  insertLink={() => {
                    setLinkAddModalVisible(true);
                  }}
                  insertImage={() => {
                    trackEvent('articleadd:content-image-upload');
                    trackEvent('editor:image-upload-start');
                    upload(creationData.group || '').then((fileId: string) => {
                      trackEvent('editor:image-upload-end');
                      textEditorRef.current?.insertImage(`${Config.cdn.baseUrl}${fileId}`);
                    });
                  }}
                  insertYoutube={() => setYoutubeAddModalVisible(true)}
                />
              ) : null}
            </View>
            {!valid && (
              <HelperText type="error" visible={!valid}>
                Veuillez ajouter un contenu
              </HelperText>
            )}
          </View>
        </KeyboardAvoidingView>
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
