// @ts-expect-error
import MarkdownIt from 'markdown-it';
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
// @ts-expect-error
import TurndownService from 'turndown-rn';

import { TranslucentStatusBar, PlatformBackButton, CollapsibleView, Content } from '@components';
import { Config } from '@constants';
import { upload } from '@redux/actions/apiActions/upload';
import { State, Account } from '@ts/types';
import { logger, checkPermission, Alert, Errors, trackEvent, Permissions } from '@utils';

import ImageUploadModal from './ImageUploadModal';
import LinkAddModal from './LinkAddModal';
import YoutubeAddModal from './YoutubeAddModal';
import getStyles from './styles';

type AddContentProps = {
  add: (parser: 'plaintext' | 'markdown', data: string) => void;
  back?: () => void;
  title?: string;
  initialContent?: { parser?: 'plaintext' | 'markdown'; data?: string };
  imageUploadGroup?: string | null; // Null if no permission
  loading?: boolean;
  placeholder?: string;
  update: (parser: 'plaintext' | 'markdown', data: string) => void;
  fetchSuggestions?: (
    editor: 'plaintext' | 'source' | 'rich',
    data: string,
  ) => { text: string; icon: string }[];
  fetchWarnings?: (
    editor: 'plaintext' | 'source' | 'rich',
    data: string,
  ) => { text: string; icon: string }[];
};

const AddContent: React.FC<AddContentProps> = ({
  add,
  initialContent,
  imageUploadGroup,
  back,
  title = 'Contenu',
  loading,
  placeholder = 'Écrivez votre contenu...',
  update,
  fetchSuggestions,
  fetchWarnings,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const { colors } = theme;

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
    ...(imageUploadGroup
      ? [
          {
            title: 'Image',
            id: 'image',
            icon: 'image-outline',
          },
        ]
      : []),
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

  const [markdown, setMarkdown] = React.useState(initialContent?.data || '');
  const [editor, setEditor] = React.useState<'plaintext' | 'source' | 'rich'>(
    initialContent?.parser === 'plaintext' ? 'plaintext' : 'rich',
  );
  const [youtubeAddModalVisible, setYoutubeAddModalVisible] = React.useState(false);

  const [linkAddModalVisible, setLinkAddModalVisible] = React.useState(false);

  const [imageUploadModalVisible, setImageUploadModalVisible] = React.useState(false);

  const [menuVisible, setMenuVisible] = React.useState<string | null>(null);

  const [viewing, setViewing] = React.useState(false);

  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  const [suggestions, setSuggestions] = React.useState<{ text: string; icon: string }[]>([]);

  const [publishWarning, setPublishWarning] = React.useState(false);

  const textEditorRef = React.useRef<RichEditor>();

  const turndownService = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
  });
  const markdownItService = new MarkdownIt({
    html: false,
  });

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

  const showSuggestions = async (data: string) => {
    setPublishWarning(false);

    if (!fetchSuggestions) {
      setSuggestions([]);
      return;
    }

    const tempSuggestions: { text: string; icon: string }[] = fetchSuggestions(editor, data);

    setSuggestions(tempSuggestions);
  };

  const showWarnings = (data: string) => {
    setPublishWarning(false);

    if (!fetchWarnings) {
      setSuggestions([]);
      return false;
    }

    const tempSuggestions: { text: string; icon: string }[] = fetchWarnings(editor, data);

    if (tempSuggestions.length) setPublishWarning(true);
    setSuggestions(tempSuggestions);

    return !!tempSuggestions.length;
  };

  const submit = async () => {
    const contentValid = markdown.length && markdown.length > 0;
    if (contentValid) {
      if (publishWarning || !showWarnings(markdown)) {
        update(editor === 'plaintext' ? 'plaintext' : 'markdown', markdown);
        add(editor === 'plaintext' ? 'plaintext' : 'markdown', markdown);
      }
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                alignContent: 'center',
              }}
            >
              {back ? <PlatformBackButton onPress={back} /> : null}
              <View style={styles.container}>
                <Title numberOfLines={1}>{title}</Title>
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
            <View style={[styles.container, { alignSelf: 'center' }]}>
              <Button
                mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
                uppercase={Platform.OS !== 'ios'}
                loading={loading}
                onPress={() => {
                  textEditorRef.current?.blurContentEditor();
                  submit();
                }}
                style={{ flex: 1 }}
              >
                {publishWarning ? 'Publier quand même' : 'Publier'}
              </Button>
            </View>
          </View>
          <CollapsibleView collapsed={!suggestions.length}>
            <Divider />
            {suggestions.map((s) => (
              <View
                style={{
                  backgroundColor: publishWarning ? colors.primaryBackground : colors.surface,
                }}
              >
                <View
                  style={[
                    styles.container,
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: 15,
                    },
                  ]}
                >
                  <Icon
                    name={s.icon}
                    size={24}
                    color={publishWarning ? colors.onPrimaryText : colors.text}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      flex: 1,
                      color: publishWarning ? colors.onPrimaryText : colors.text,
                    }}
                  >
                    {s.text}
                  </Text>
                </View>
              </View>
            ))}
          </CollapsibleView>
          <Divider />
          <View style={{ backgroundColor: colors.surface }}>
            <CollapsibleView collapsed={viewing}>
              <ScrollView horizontal>
                {editor === 'rich' ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      uppercase={false}
                      mode={menuVisible === 'heading' ? 'outlined' : 'text'}
                      style={{ marginLeft: 10 }}
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
                      style={{ marginLeft: 30 }}
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
                      icon="format-clear"
                      accessibilityLabel="Retirer le formattage"
                      color={colors.text}
                      onPress={() => {
                        // @ts-expect-error Wrong type defs in library
                        textEditorRef.current?.sendAction('removeFormat', 'result');
                        // @ts-expect-error Wrong type defs in library
                        textEditorRef.current?.sendAction('paragraph', 'result');
                      }}
                    />
                    <IconButton
                      icon="undo-variant"
                      accessibilityLabel="Défaire"
                      color={colors.text}
                      style={{ marginLeft: 30 }}
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
                  </View>
                ) : null}
                <View>
                  <IconButton
                    icon="cog"
                    style={{ marginLeft: 30 }}
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
                                if (!imageUploadGroup) return;
                                if (Platform.OS === 'web') {
                                  setImageUploadModalVisible(true);
                                  return;
                                }
                                trackEvent('articleadd:content-image-upload');
                                trackEvent('editor:image-upload-start');
                                upload(imageUploadGroup, 'content-inline').then((fileId) => {
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
                            Ci-dessous, le contenu tel qu&apos;il s&apos;affichera après
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
                      onChange={(data: string) => {
                        const md = turndownService
                          .turndown(data)
                          .replace(new RegExp(Config.google.youtubePlaceholder, 'g'), 'youtube://')
                          .replace(new RegExp(Config.cdn.baseUrl, 'g'), 'cdn://');
                        setMarkdown(md);
                        showSuggestions(md);
                        update('markdown', md);
                      }}
                      editorStyle={{
                        backgroundColor: colors.background,
                        color: colors.text,
                        placeholderColor: colors.disabled,
                      }}
                      placeholder={placeholder}
                      initialContentHTML={markdownItService
                        .render(markdown)
                        .replace(new RegExp('youtube://', 'g'), Config.google.youtubePlaceholder)
                        .replace(new RegExp('cdn://', 'g'), Config.cdn.baseUrl)}
                      editorInitializedCallback={() => {
                        logger.debug('Editor toolbar initialized');
                        trackEvent('articleadd:content-editor-loaded');
                        textEditorRef.current?.registerToolbar((i) => setSelectedItems(i));
                      }}
                      useContainer={false}
                    />
                  )}
                  {(editor === 'source' || editor === 'plaintext') && (
                    <TextInput
                      placeholder={placeholder}
                      multiline
                      numberOfLines={20}
                      mode="outlined"
                      value={markdown}
                      onChangeText={(data: string) => {
                        showSuggestions(data);
                        setMarkdown(data);
                        update(editor === 'plaintext' ? 'plaintext' : 'markdown', data);
                      }}
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
      {Platform.OS === 'web' && imageUploadGroup ? (
        <ImageUploadModal
          visible={imageUploadModalVisible}
          setVisible={setImageUploadModalVisible}
          group={imageUploadGroup}
          insertImage={(fileId) => {
            textEditorRef.current?.insertImage(`${Config.cdn.baseUrl}${fileId}`);
          }}
        />
      ) : null}
    </View>
  );
};

export default AddContent;
