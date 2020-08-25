import React from 'react';
import { connect } from 'react-redux';

import { View, ScrollView } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';

import { State, EventRequestState, EventCreationData } from '@ts/types';
import { logger } from '@utils/index';
import {
  TranslucentStatusBar,
  StepperView,
  ErrorMessage,
  Illustration,
  PlatformBackButton,
} from '@components/index';
import { register } from '@redux/actions/data/account';
import { eventAdd } from '@redux/actions/apiActions/events';
import { clearEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';

import type { EventStackParams } from '../index';
import getEventStyles from '../styles/Styles';
import EventAddPageGroup from '../components/AddGroup';
import EventAddPageLocation from '../components/AddLocation';
import EventAddPageMeta from '../components/AddMeta';
import EventAddPageContent from '../components/AddContent';
import EventAddPageTags from '../components/AddTags';

type Props = {
  navigation: StackNavigationProp<EventStackParams, 'Add'>;
  reqState: EventRequestState;
  creationData?: EventCreationData;
};

const EventAdd: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);

  const add = (parser?: 'markdown' | 'plaintext', data?: string) => {
    eventAdd({
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
      clearEventCreationData();
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
              what: "l'ajout de l'évènement",
              contentSingular: "L'évènement",
            }}
            type="axios"
            retry={add}
          />
        )}
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <PlatformBackButton onPress={navigation.goBack} />
          <View style={styles.centerIllustrationContainer}>
            <Text style={eventStyles.title}>Créer un évènement</Text>
          </View>
          <StepperView
            pages={[
              {
                key: 'group',
                icon: 'account-group',
                title: 'Groupe',
                component: <EventAddPageGroup />,
              },
              {
                key: 'location',
                icon: 'map-marker',
                title: 'Localisation',
                component: <EventAddPageLocation navigation={navigation} />,
              },
              {
                key: 'meta',
                icon: 'information',
                title: 'Meta',
                component: <EventAddPageMeta />,
              },
              {
                key: 'tags',
                icon: 'tag-multiple',
                title: 'Tags',
                component: <EventAddPageTags />,
              },
              {
                key: 'content',
                icon: 'pencil',
                title: 'Contenu',
                component: <EventAddPageContent add={add} />,
              },
            ]}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { events, eventData } = state;
  return { creationData: eventData.creationData, reqState: events.state };
};

export default connect(mapStateToProps)(EventAdd);
