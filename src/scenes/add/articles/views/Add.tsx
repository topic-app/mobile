import React from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';

import {
  TranslucentStatusBar,
  StepperView,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils/index';

import ArticleAddPageGroup from '../components/AddGroup';
import ArticleAddPageLocation from '../components/AddLocation';
import ArticleAddPageMeta from '../components/AddMeta';
import ArticleAddPageTags from '../components/AddTags';
import type { ArticleAddScreenNavigationProp } from '../index';
import getArticleStyles from '../styles/Styles';

type ArticleAddProps = {
  navigation: ArticleAddScreenNavigationProp<'Add'>;
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
                component: (props) => <ArticleAddPageGroup {...props} />,
              },
              {
                key: 'location',
                icon: 'map-marker',
                title: 'Localisation',
                component: (props) => <ArticleAddPageLocation navigation={navigation} {...props} />,
              },
              {
                key: 'meta',
                icon: 'information',
                title: 'Meta',
                component: (props) => <ArticleAddPageMeta {...props} />,
              },
              {
                key: 'tags',
                icon: 'tag-multiple',
                title: 'Tags',
                component: (props) => (
                  <ArticleAddPageTags
                    navigate={() => navigation.navigate('AddContent')}
                    {...props}
                  />
                ),
              },
              {
                key: 'content',
                icon: 'pencil',
                title: 'Contenu',
                component: () => <View />,
              },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ArticleAdd;
