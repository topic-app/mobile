import React, { LegacyRef } from 'react';
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
import { RichToolbar, RichEditor } from 'react-native-pell-rich-editor';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
// @ts-expect-error
import TurndownService from 'turndown-rn';

import { TranslucentStatusBar, PlatformBackButton, CollapsibleView, Content } from '@components';
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

  const headings = [
    {
      title: 'Paragraphe',
      id: 'paragraph',
    },
    {
      title: 'Titre 1',
      id: 'heading1',
    },
    {
      title: 'Titre 2',
      id: 'heading2',
    },
    {
      title: 'Titre 3',
      id: 'heading3',
    },
  ];

  const inserts: (
    | { title: string; id: string; icon: string; divider?: false }
    | { divider: true }
  )[] = [
    {
      title: 'Image',
      id: 'image',
      icon: 'image-outline',
    },
    {
      title: 'Lien',
      id: 'link',
      icon: 'link',
    },
    {
      title: 'Vidéo youtube',
      id: 'youtube',
      icon: 'youtube',
    },
    {
      divider: true,
    },
    {
      title: 'Citation',
      id: 'quote',
      icon: 'format-quote-close',
    },
    {
      divider: true,
    },
    {
      title: 'Liste simple',
      id: 'unorderedList',
      icon: 'format-list-bulleted',
    },
    {
      title: 'Liste ordonnée',
      id: 'orderedList',
      icon: 'format-list-numbered',
    },
  ];

  const [valid, setValid] = React.useState(true);

  const [markdown, setMarkdown] = React.useState(creationData.data || '');
  const [editor, setEditor] = React.useState<'plaintext' | 'source' | 'rich'>(
    creationData.editing ? (creationData.parser === 'markdown' ? 'source' : 'plaintext') : 'rich',
  );
  const [youtubeAddModalVisible, setYoutubeAddModalVisible] = React.useState(false);

  const [linkAddModalVisible, setLinkAddModalVisible] = React.useState(false);

  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  const [viewing, setViewing] = React.useState(false);

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const textEditorRef = React.useRef<RichEditor>();

  const turndownService = new TurndownService();

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
        size={24}
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
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
                accessibilityLabel={viewing ? 'Mode éditeur' : 'Mode relecture'}
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
          <View style={{ backgroundColor: colors.surface }}>
            <CollapsibleView collapsed={viewing}>
              <ScrollView horizontal>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    uppercase={false}
                    mode={menuVisible === 'heading' ? 'outlined' : 'text'}
                    color={colors.text}
                    onPress={() =>
                      menuVisible === 'heading' ? setMenuVisible(null) : setMenuVisible('heading')
                    }
                  >
                    {headings.find((h) => selectedItems.includes(h.id))?.title || 'Paragraphe'}
                  </Button>
                  <Button
                    uppercase={false}
                    mode={menuVisible === 'insert' ? 'outlined' : 'text'}
                    color={colors.text}
                    onPress={() =>
                      menuVisible === 'insert' ? setMenuVisible(null) : setMenuVisible('insert')
                    }
                  >
                    Insérer
                  </Button>
                  <IconButton
                    icon="format-bold"
                    accessibilityLabel="Gras"
                    color={selectedItems.includes('bold') ? colors.primary : colors.text}
                    // @ts-expect-error Wrong type defs in library
                    onPress={() => textEditorRef.current?.sendAction('bold', 'result')}
                  />
                  <IconButton
                    icon="format-italic"
                    accessibilityLabel="Italique"
                    color={selectedItems.includes('italic') ? colors.primary : colors.text}
                    // @ts-expect-error Wrong type defs in library
                    onPress={() => textEditorRef.current?.sendAction('italic', 'result')}
                  />
                  <IconButton
                    icon="undo-variant"
                    accessibilityLabel="Défaire"
                    color={colors.text}
                    // @ts-expect-error Wrong type defs in library
                    onPress={() => textEditorRef.current?.sendAction('undo', 'result')}
                  />
                  <IconButton
                    icon="redo-variant"
                    accessibilityLabel="Refaire"
                    color={colors.text}
                    // @ts-expect-error Wrong type defs in library
                    onPress={() => textEditorRef.current?.sendAction('redo', 'result')}
                  />
                  <IconButton
                    icon="cog"
                    style={{ marginLeft: 20 }}
                    accessibilityLabel="Changer le type d'éditeur"
                    color={colors.text}
                    onPress={() =>
                      menuVisible === 'editor' ? setMenuVisible(null) : setMenuVisible('editor')
                    }
                  />
                </View>
              </ScrollView>
              {!valid && (
                <HelperText type="error" visible={!valid}>
                  Veuillez ajouter un contenu
                </HelperText>
              )}
              <CollapsibleView collapsed={!menuVisible}>
                <View>
                  <Divider />
                  {menuVisible === 'editor' && (
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
                                  { text: 'Annuler', onPress: () => setMenuVisible(null) },
                                  {
                                    text: 'Changer',
                                    onPress: () => {
                                      setEditor(i.type);
                                      setMenuVisible(null);
                                    },
                                  },
                                ],
                                { cancelable: true },
                              );
                            } else {
                              setEditor(i.type);
                              setMenuVisible(null);
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
                  )}
                  {menuVisible === 'heading' && (
                    <View>
                      {headings.map((h) => (
                        <List.Item
                          title={h.title}
                          key={h.id}
                          onPress={() => {
                            setMenuVisible(null);
                            // @ts-expect-error Wrong type defs in library
                            textEditorRef.current?.sendAction(h.id, 'result');
                          }}
                          left={() => (
                            <RadioButton
                              color={colors.primary}
                              value=""
                              status={
                                selectedItems.includes(h.id) ||
                                (h.id === 'paragraph' &&
                                  !selectedItems.some((i) => i.startsWith('heading')))
                                  ? 'checked'
                                  : 'unchecked'
                              }
                            />
                          )}
                        />
                      ))}
                    </View>
                  )}
                  {menuVisible === 'insert' && (
                    <View>
                      {inserts.map((i) => {
                        if (i.divider) {
                          return <Divider />;
                        }
                        return (
                          <List.Item
                            title={i.title}
                            key={i.id}
                            left={() => (
                              <Icon
                                name={i.icon}
                                color={colors.text}
                                size={24}
                                style={{ alignSelf: 'center' }}
                              />
                            )}
                            onPress={() => {
                              setMenuVisible(null);
                              if (i.id === 'image') {
                                trackEvent('articleadd:content-image-upload');
                                trackEvent('editor:image-upload-start');
                                upload(creationData.group || '').then((fileId: string) => {
                                  trackEvent('editor:image-upload-end');
                                  textEditorRef.current?.insertImage(
                                    `${Config.cdn.baseUrl}${fileId}`,
                                  );
                                });
                              } else if (i.id === 'link') {
                                setLinkAddModalVisible(true);
                              } else if (i.id === 'youtube') {
                                setYoutubeAddModalVisible(true);
                              } else {
                                // @ts-expect-error Wrong type defs in library
                                textEditorRef.current?.sendAction(i.id, 'result');
                              }
                            }}
                          />
                        );
                      })}
                    </View>
                  )}
                </View>
              </CollapsibleView>
            </CollapsibleView>
          </View>
          <Divider />
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
            <View style={styles.formContainer}>
              <View style={styles.textInputContainer}>
                <CollapsibleView collapsed={!viewing}>
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
                </CollapsibleView>
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
                      ref={textEditorRef as LegacyRef<RichEditor>}
                      onChange={(data: string) =>
                        setMarkdown(
                          turndownService
                            .turndown(data)
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
                        textEditorRef.current?.registerToolbar((i) => setSelectedItems(i));
                      }}
                    />
                  )}
                  {(editor === 'source' || editor === 'plaintext') && (
                    <TextInput
                      placeholder="Écrivez votre article..."
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
