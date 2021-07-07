import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { TranslucentStatusBar, StepperView, PlatformBackButton } from '@components';
import {
  State,
  ArticleRequestState,
  ArticleCreationData,
  GroupTemplate,
  GroupRequestState,
} from '@ts/types';

import type { GroupAddScreenNavigationProp } from '.';
import GroupAddPageLocation from './components/AddLocation';
import GroupAddPageMeta from './components/AddMeta';
import GroupAddPageProof from './components/AddProof';
import GroupAddPageReview from './components/AddReview';
import GroupAddPageTemplate from './components/AddTemplate';
import getStyles from './styles';

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

  const scrollViewRef = React.useRef<ScrollView>(null);

  return (
    <View style={styles.page}>
      <SafeAreaView style={{ flex: 1 }}>
        <TranslucentStatusBar />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled ref={scrollViewRef}>
            <PlatformBackButton onPress={navigation.goBack} />
            <View style={styles.centerIllustrationContainer}>
              <Text style={styles.title}>Créer un groupe</Text>
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
                  title: 'Vérif.',
                  component: (props) => <GroupAddPageReview navigation={navigation} {...props} />,
                },
              ]}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return { groupState: groups.state, templates: groups.templates };
};

export default connect(mapStateToProps)(GroupAdd);
