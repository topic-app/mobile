import React from 'react';
import { connect } from 'react-redux';

import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, ProgressBar, useTheme, Button, HelperText } from 'react-native-paper';
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

  const { colors } = theme;

  const stepperRef = React.useRef(null);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={styles.centerIllustrationContainer}>
            <Text style={articleStyles.title}>Écrire un article</Text>
          </View>
          <StepperView
            ref={stepperRef}
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
                component: (
                  <ArticleAddPageTags navigate={() => navigation.navigate('AddContent')} />
                ),
              },
              {
                key: 'content',
                icon: 'pencil',
                title: 'Contenu',
                component: <View />,
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
