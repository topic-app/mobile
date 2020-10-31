import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  TranslucentStatusBar,
  StepperView,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

import type { ArticleAddStackParams } from '../index';
import getArticleStyles from '../styles/Styles';
import ArticleAddPageGroup from '../components/AddGroup';
import ArticleAddPageLocation from '../components/AddLocation';
import ArticleAddPageMeta from '../components/AddMeta';
import ArticleAddPageTags from '../components/AddTags';

type ArticleAddProps = {
  navigation: StackNavigationProp<ArticleAddStackParams, 'Add'>;
};

const ArticleAdd: React.FC<ArticleAddProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

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

export default ArticleAdd;
