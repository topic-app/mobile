import React from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import { connect } from 'react-redux';

import {
  TranslucentStatusBar,
  StepperView,
  ErrorMessage,
  SafeAreaView,
  PlatformBackButton,
} from '@components/index';
import { eventAdd } from '@redux/actions/apiActions/events';
import { clearEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { State, EventRequestState, EventCreationData, ProgramEntry } from '@ts/types';
import { useTheme } from '@utils/index';

import EventAddPageContact from '../components/AddContact';
import EventAddPageDuration from '../components/AddDuration';
import EventAddPageGroup from '../components/AddGroup';
import EventAddPageLocation from '../components/AddLocation';
import EventAddPageMeta from '../components/AddMeta';
import EventAddPagePlace from '../components/AddPlace';
import EventAddPageProgram from '../components/AddProgram';
import EventAddPageTags from '../components/AddTags';
import type { EventAddScreenNavigationProp } from '../index';
import getEventStyles from '../styles/Styles';

type Props = {
  navigation: EventAddScreenNavigationProp<'Add'>;
  reqState: EventRequestState;
  creationData?: EventCreationData;
};

const EventAdd: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const eventStyles = getEventStyles(theme);

  const add = (program?: ProgramEntry[]) => {
    eventAdd({
      title: creationData.title,
      summary: creationData.summary,
      data: creationData.description,
      phone: creationData.phone,
      email: creationData.email,
      contact: creationData.contact,
      members: creationData.members,
      start: creationData.start,
      end: creationData.end,
      date: new Date(),
      location: creationData.location,
      group: creationData.group,
      places: creationData.places,
      parser: creationData.parser,
      image: creationData.image,
      preferences: {
        comments: true,
      },
      tags: creationData.tags,
      program: program || creationData.program,
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
                component: (props) => <EventAddPageGroup {...props} />,
              },
              {
                key: 'location',
                icon: 'map-marker',
                title: 'Loc.',
                component: (props) => <EventAddPageLocation navigation={navigation} {...props} />,
              },
              {
                key: 'meta',
                icon: 'information',
                title: 'Info',
                component: (props) => <EventAddPageMeta {...props} />,
              },
              {
                key: 'tags',
                icon: 'tag-multiple',
                title: 'Tags',
                component: (props) => <EventAddPageTags {...props} />,
              },
              {
                key: 'place',
                icon: 'map',
                title: 'Lieu',
                component: (props) => <EventAddPagePlace {...props} />,
              },
              {
                key: 'duration',
                icon: 'clock',
                title: 'Durée',
                component: (props) => <EventAddPageDuration {...props} />,
              },
              {
                key: 'contact',
                icon: 'at',
                title: 'Contact',
                component: (props) => <EventAddPageContact {...props} />,
              },
              {
                key: 'program',
                icon: 'script-text',
                title: 'Prog.',
                component: (props) => <EventAddPageProgram add={add} {...props} />,
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
