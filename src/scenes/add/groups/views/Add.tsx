import React from 'react';
import { connect } from 'react-redux';

import { View, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

import {
  State,
  ArticleRequestState,
  ArticleCreationData,
  GroupTemplate,
  GroupRequestState,
} from '@ts/types';
import {
  TranslucentStatusBar,
  StepperView,
  PlatformBackButton,
  SafeAreaView,
} from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';

import type { GroupAddStackParams } from '../index';
import getArticleStyles from '../styles/Styles';
import GroupAddPageTemplate from '../components/AddTemplate2';
import GroupAddPageLocation from '../components/AddLocation';
import GroupAddPageMeta from '../components/AddMeta';
// import GroupAddPageProof from '../components/AddProof';

type Props = {
  navigation: StackNavigationProp<GroupAddStackParams, 'Add'>;
  reqState: ArticleRequestState;
  creationData?: ArticleCreationData;
  templates: GroupTemplate[];
  groupState: GroupRequestState;
};

const ArticleAdd: React.FC<Props> = ({ navigation, templates, groupState }) => {
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
            <Text style={articleStyles.title}>Créer un groupe</Text>
          </View>
          <StepperView
            pages={[
              {
                key: 'group',
                icon: 'account-group',
                title: 'Type',
                component: <GroupAddPageTemplate templates={templates} state={groupState} />,
              },
              {
                key: 'location',
                icon: 'map-marker',
                title: 'Localisation',
                component: <GroupAddPageLocation navigation={navigation} />,
              },
              {
                key: 'meta',
                icon: 'information',
                title: 'Info',
                component: <GroupAddPageMeta />,
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

export default connect(mapStateToProps)(ArticleAdd);
