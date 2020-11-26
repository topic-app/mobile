import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';

import { State, EventRequestState, EventCreationData } from '@ts/types';
import {
  TranslucentStatusBar,
  StepperView,
  ErrorMessage,
  SafeAreaView,
  PlatformBackButton,
} from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { eventAdd } from '@redux/actions/apiActions/events';
import { clearEventCreationData } from '@redux/actions/contentData/events';

import type { EventAddStackParams } from '../index';
import getEventStyles from '../styles/Styles';
import EventAddPageGroup from '../components/AddGroup';
import EventAddPageLocation from '../components/AddLocation';
import EventAddPageMeta from '../components/AddMeta';
import EventAddPageDuration from '../components/AddDuration';
import EventAddPagePlace from '../components/AddPlace';
import EventAddPageProgram from '../components/AddProgram';
import EventAddPageTags from '../components/AddTags';
import EventAddPageContact from '../components/AddContact';

type Props = {
  navigation: StackNavigationProp<EventAddStackParams, 'Add'>;
  reqState: EventRequestState;
  creationData?: EventCreationData;
};

const EventAdd: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);

  const add = (parser?: 'markdown' | 'plaintext') => {
    eventAdd({
      title: creationData.title,
      summary: creationData.summary,
      data: creationData.description,
      phone: creationData.phone,
      email: creationData.email,
      contact: creationData.contact,
      organizers: creationData.organizers,
      start: creationData.start,
      end: creationData.end,
      date: Date.now(),
      location: creationData.location,
      group: creationData.group,
      places: creationData.place,
      parser: parser || creationData.parser,
      preferences: null,
      tags: creationData.tags,
      program: creationData.program,
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
                key: 'program',
                icon: 'script-text',
                title: 'Programme',
                component: <EventAddPageProgram add={add} />,
              },
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
                title: 'Info',
                component: <EventAddPageMeta />,
              },
              {
                key: 'tags',
                icon: 'tag-multiple',
                title: 'Tags',
                component: <EventAddPageTags />,
              },
              {
                key: 'place',
                icon: 'map',
                title: 'Lieu',
                component: <EventAddPagePlace />,
              },
              {
                key: 'duration',
                icon: 'clock',
                title: 'Durée',
                component: <EventAddPageDuration />,
              },
              {
                key: 'contact',
                icon: 'at',
                title: 'Contact',
                component: <EventAddPageContact />,
              },
              {
                key: 'program',
                icon: 'script-text',
                title: 'Programme',
                component: <EventAddPageProgram add={add} />,
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
