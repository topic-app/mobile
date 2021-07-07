import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import {
  TranslucentStatusBar,
  StepperView,
  PlatformBackButton,
  StepperViewPageProps,
  PageContainer,
} from '@components';
import getStyles from '@styles/global';
import { ArticleCreationData, State } from '@ts/types';
import { trackEvent } from '@utils';

import type { ArticleAddScreenNavigationProp } from '.';
import ArticleAddPageGroup from './components/AddGroup';
import ArticleAddPageLocation from './components/AddLocation';
import ArticleAddPageMeta from './components/AddMeta';
import ArticleAddPageTags from './components/AddTags';
import getArticleStyles from './styles';

type ArticleAddProps = {
  navigation: ArticleAddScreenNavigationProp<'Add'>;
  creationData: ArticleCreationData;
};

const ArticleAdd: React.FC<ArticleAddProps> = ({ navigation, creationData }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => trackEvent('articleadd:page-group'), []);

  return (
    <PageContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled ref={scrollViewRef}>
            <PlatformBackButton onPress={navigation.goBack} />
            <View style={styles.centerIllustrationContainer}>
              <Text style={articleStyles.title} numberOfLines={1}>
                {creationData.editing ? `Modifier "${creationData.title}"` : 'Écrire un article'}
              </Text>
            </View>
            <StepperView
              onChange={() => scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })}
              pages={[
                ...(creationData.editing
                  ? []
                  : [
                      {
                        key: 'group',
                        icon: 'account-group',
                        title: 'Groupe',
                        component: (props: StepperViewPageProps) => (
                          <ArticleAddPageGroup {...props} />
                        ),
                      },
                    ]),
                {
                  key: 'location',
                  icon: 'map-marker',
                  title: 'Localisation',
                  component: (props) => (
                    <ArticleAddPageLocation navigation={navigation} {...props} />
                  ),
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </PageContainer>
  );
};

const mapStateToProps = (state: State) => {
  const { articleData } = state;
  return { creationData: articleData.creationData };
};

export default connect(mapStateToProps)(ArticleAdd);
