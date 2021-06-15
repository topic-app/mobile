import '@toast-ui/editor/dist/i18n/fr-fr';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import 'codemirror/lib/codemirror.css';
import React from 'react';
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import { Button, Title, Divider, IconButton, Card, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { TranslucentStatusBar, PlatformBackButton, Content } from '@components';
import { Config } from '@constants';
import { articleAdd, articleModify } from '@redux/actions/apiActions/articles';
import {
  clearArticleCreationData,
  updateArticleCreationData,
} from '@redux/actions/contentData/articles';
import { State, ArticleRequestState, ArticleCreationData, Account } from '@ts/types';
import { Alert, Errors, trackEvent } from '@utils';

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

  const [valid, setValid] = React.useState(true);

  const [editor, setEditor] = React.useState<'plaintext' | 'source' | 'rich'>(
    Platform.OS === 'web' ? 'source' : 'rich',
  );
  const [youtubeAddModalVisible, setYoutubeAddModalVisible] = React.useState(false);

  const [linkAddModalVisible, setLinkAddModalVisible] = React.useState(false);

  const [viewing, setViewing] = React.useState(false);

  const [markdown, setMarkdown] = React.useState(
    creationData.data
      ?.replace(/\n/g, '<br>')
      .replace(new RegExp('youtube://', 'g'), Config.google.youtubePlaceholder)
      .replace(new RegExp('cdn://', 'g'), Config.cdn.baseUrl) || '',
  );

  const textEditorRef = React.createRef<Editor>();

  const dimensions = useWindowDimensions();

  if (!account.loggedIn) return null;

  const submit = async (md?: string) => {
    const contentValid = markdown && markdown.length && markdown.length > 0;
    if (contentValid) {
      updateArticleCreationData({ parser: 'markdown', data: md || markdown });
      add(editor === 'plaintext' ? 'plaintext' : 'markdown', md || markdown);
    } else {
      setValid(false);
    }
  };

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
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
                {creationData.editing ? 'Modification de ' : ''}
                {creationData?.title}
              </Title>
            </View>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <IconButton
              accessibilityLabel={viewing ? 'Mode éditeur' : 'Mode relecture'}
              onPress={() => {
                if (!viewing) {
                  Keyboard.dismiss();
                }
                setMarkdown(
                  textEditorRef.current
                    ?.getInstance()
                    ?.getMarkdown()
                    ?.replace(/<br>/g, '\n')
                    .replace(new RegExp(Config.google.youtubePlaceholder, 'g'), 'youtube://')
                    .replace(new RegExp(Config.cdn.baseUrl, 'g'), 'cdn://') || markdown,
                );
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
                const md =
                  textEditorRef.current
                    ?.getInstance()
                    ?.getMarkdown()
                    ?.replace(/<br>/g, '\n')
                    .replace(new RegExp(Config.google.youtubePlaceholder, 'g'), 'youtube://')
                    .replace(new RegExp(Config.cdn.baseUrl, 'g'), 'cdn://') || markdown;
                setMarkdown(md);
                submit(md);
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
                <Editor
                  ref={textEditorRef}
                  initialValue={markdown}
                  previewStyle="vertical"
                  usageStatistics={false}
                  height={`${dimensions.height - 200}px`}
                  initialEditType="wysiwyg"
                  useCommandShortcut
                  language="fr"
                  placeholder="Écrivez votre article..."
                  events={{}}
                  toolbarItems={[
                    'heading',
                    'bold',
                    'italic',
                    'strike',
                    'divider',
                    'hr',
                    'quote',
                    'divider',
                    'ul',
                    'ol',
                    'indent',
                    'outdent',
                    'divider',
                    'table',
                    'link',
                    'divider',
                    'code',
                    'codeblock',
                    'divider',
                  ]}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <LinkAddModal
        visible={linkAddModalVisible}
        setVisible={setLinkAddModalVisible}
        add={(link, name) => {
          setLinkAddModalVisible(false);
          // textEditorRef.current?.insertLink(name, link);
        }}
      />
      <YoutubeAddModal
        visible={youtubeAddModalVisible}
        setVisible={setYoutubeAddModalVisible}
        add={(url) => {
          setLinkAddModalVisible(false);
          // textEditorRef.current?.insertImage(url);
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
