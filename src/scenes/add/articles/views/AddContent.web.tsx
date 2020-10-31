import React from 'react';
import { View, ScrollView, Platform, Alert } from 'react-native';
import { ProgressBar, Button, HelperText, Title, Divider } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import showdown from 'showdown';

import { State, ArticleRequestState, ArticleCreationData } from '@ts/types';
import {
  TranslucentStatusBar,
  ErrorMessage,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { articleAdd } from '@redux/actions/apiActions/articles';
import {
  clearArticleCreationData,
  updateArticleCreationData,
} from '@redux/actions/contentData/articles';

import type { ArticleAddStackParams } from '../index';
import LinkAddModal from '../components/LinkAddModal';
import getArticleStyles from '../styles/Styles';

type Props = {
  navigation: StackNavigationProp<ArticleAddStackParams, 'AddContent'>;
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

  const [valid, setValid] = React.useState(true);

  const textEditorRef = React.createRef<RichEditor>(null);

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
    const contentVal = await textEditorRef.current?.getContentHtml();

    const converter = new showdown.Converter();

    // No idea why, this fails with "undefined is not a function" even though turndown is a function (see with console.log)
    console.log(converter);
    const contentMarkdown = converter.makeMarkdown(contentVal);

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
            <View style={articleStyles.textInputContainer}></View>
          </View>
        </ScrollView>
        <View style={{ backgroundColor: colors.surface }}>
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
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, articleData } = state;
  return { creationData: articleData.creationData, reqState: articles.state };
};

export default connect(mapStateToProps)(ArticleAddContent);
