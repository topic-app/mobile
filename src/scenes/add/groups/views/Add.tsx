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
import getStyles from '@styles/Styles';

import type { GroupStackParams } from '../index';
import getArticleStyles from '../styles/Styles';
import GroupAddPageTemplate from '../components/AddTemplate';
import GroupAddPageLocation from '../components/AddLocation';
// import GroupAddPageMeta from '../components/AddMeta';
// import GroupAddPageProof from '../components/AddProof';

type Props = {
  navigation: StackNavigationProp<GroupStackParams, 'Add'>;
  reqState: ArticleRequestState;
  creationData?: ArticleCreationData;
};

const ArticleAdd: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const { colors } = theme;

  const stepperRef = React.useRef(null);

  console.log(stepperRef.current);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={styles.centerIllustrationContainer}>
            <Text style={articleStyles.title}>Créer un groupe</Text>
          </View>
          <StepperView
            ref={stepperRef}
            pages={[
              {
                key: 'group',
                icon: 'account-group',
                title: 'Type',
                component: <GroupAddPageTemplate />,
              },
              {
                key: 'location',
                icon: 'map-marker',
                title: 'Localisation',
                component: <GroupAddPageLocation navigation={navigation} />,
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
