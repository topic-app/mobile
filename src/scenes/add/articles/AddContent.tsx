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
import { connect } from 'react-redux';
// @ts-expect-error
import TurndownService from 'turndown-rn';

import {
  TranslucentStatusBar,
  PlatformBackButton,
  CollapsibleView,
  Content,
  ContentEditor,
} from '@components';
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

  const fetchSuggestions = (editor: 'source' | 'rich' | 'plaintext', data: string) => {
    const tempSuggestions: { text: string; icon: string }[] = [];

    if (data.length > 700 && !data.match(/#/g) && editor !== 'plaintext') {
      tempSuggestions.push({
        icon: 'information-outline',
        text:
          'Vous pouvez utiliser des titres via le menu "Paragraphe" pour organiser votre article',
      });
    }

    return tempSuggestions;
  };

  const fetchWarnings = (editor: 'source' | 'rich' | 'plaintext', data: string) => {
    const tempSuggestions: { text: string; icon: string }[] = [];

    // Length
    if (data.length < 500) {
      tempSuggestions.push({
        icon: 'alert-circle-outline',
        text:
          "Votre article est plutôt court. N'hésitez pas à rajouter quelques phrases pour donner plus de détails",
      });
    }

    return tempSuggestions;
  };

  const update = (parser: 'markdown' | 'plaintext', data: string) =>
    updateArticleCreationData({ parser, data });

  return (
    <ContentEditor
      add={add}
      update={update}
      placeholder="Écrivez votre article..."
      title={creationData.title}
      initialContent={{ parser: creationData.parser, data: creationData.data }}
      fetchSuggestions={fetchSuggestions}
      fetchWarnings={fetchWarnings}
      loading={reqState.add?.loading}
      back={() => navigation.goBack()}
      imageUploadGroup={
        checkPermission(account, {
          permission: Permissions.CONTENT_UPLOAD,
          scope: { groups: [creationData.group || ''] },
        }) && creationData.group
          ? creationData.group
          : null
      }
    />
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
