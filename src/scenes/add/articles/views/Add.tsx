import React from 'react';
import { connect } from 'react-redux';

import { View, ScrollView } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
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
import { clearArticleCreationData } from '@redux/actions/contentData/articles';

import type { ArticleStackParams } from '../index';
import getArticleStyles from '../styles/Styles';
import ArticleAddPageGroup from '../components/AddGroup';
import ArticleAddPageLocation from '../components/AddLocation';
import ArticleAddPageMeta from '../components/AddMeta';
import ArticleAddPageContent from '../components/AddContent';
import ArticleAddPageTags from '../components/AddTags';

type Props = {
  navigation: StackNavigationProp<ArticleStackParams, 'Add'>;
  reqState: ArticleRequestState;
  creationData?: ArticleCreationData;
};

const ArticleAdd: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

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
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={styles.centerIllustrationContainer}>
            <Text style={articleStyles.title}>Écrire un article</Text>
          </View>
          <StepperView
            pages={[
              {
                key: 'group',
                icon: 'account-group',
                title: 'Groupe',
                component: <ArticleAddPageGroup />,
              },
              {
                key: 'location',
                icon: 'map-marker',
                title: 'Localisation',
                component: <ArticleAddPageLocation navigation={navigation} />,
              },
              {
                key: 'meta',
                icon: 'information',
                title: 'Meta',
                component: <ArticleAddPageMeta />,
              },
              {
                key: 'tags',
                icon: 'tag-multiple',
                title: 'Tags',
                component: <ArticleAddPageTags />,
              },
              {
                key: 'content',
                icon: 'pencil',
                title: 'Contenu',
                component: <ArticleAddPageContent add={add} />,
              },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { articles, articleData } = state;
  return { creationData: articleData.creationData, reqState: articles.state };
};

export default connect(mapStateToProps)(ArticleAdd);
