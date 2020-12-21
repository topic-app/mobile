import React from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Text } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  TranslucentStatusBar,
  StepperView,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import getStyles from '@styles/Styles';
import {
  State,
  ArticleRequestState,
  ArticleCreationData,
  GroupTemplate,
  GroupRequestState,
} from '@ts/types';
import { useTheme } from '@utils/index';

import GroupAddPageLocation from '../components/AddLocation';
import GroupAddPageMeta from '../components/AddMeta';
import GroupAddPageProof from '../components/AddProof';
import GroupAddPageReview from '../components/AddReview';
import GroupAddPageTemplate from '../components/AddTemplate';
import type { GroupAddScreenNavigationProp } from '../index';
import getArticleStyles from '../styles/Styles';

type Props = {
  navigation: GroupAddScreenNavigationProp<'Add'>;
  reqState: ArticleRequestState;
  creationData?: ArticleCreationData;
  templates: GroupTemplate[];
  groupState: GroupRequestState;
};

const GroupAdd: React.FC<Props> = ({ navigation, templates, groupState }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const articleStyles = getArticleStyles(theme);

  const scrollViewRef = React.useRef<ScrollView>(null);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled ref={scrollViewRef}>
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={styles.centerIllustrationContainer}>
            <Text style={articleStyles.title}>Créer un groupe</Text>
          </View>
          <StepperView
            onChange={() => scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })}
            pages={[
              {
                key: 'group',
                icon: 'account-group',
                title: 'Type',
                component: (props) => (
                  <GroupAddPageTemplate templates={templates} state={groupState} {...props} />
                ),
              },
              {
                key: 'location',
                icon: 'map-marker',
                title: 'Localisation',
                component: (props) => <GroupAddPageLocation navigation={navigation} {...props} />,
              },
              {
                key: 'meta',
                icon: 'information',
                title: 'Info',
                component: (props) => <GroupAddPageMeta {...props} />,
              },
              {
                key: 'proof',
                icon: 'script-text',
                title: 'Légal',
                component: (props) => <GroupAddPageProof navigation={navigation} {...props} />,
              },
              {
                key: 'review',
                icon: 'check-bold',
                title: 'Confirmation',
                component: (props) => <GroupAddPageReview navigation={navigation} {...props} />,
              },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return { groupState: groups.state, templates: groups.templates };
};

export default connect(mapStateToProps)(GroupAdd);
