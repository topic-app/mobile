import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

import { TranslucentStatusBar, StepperView, PlatformBackButton } from '@components';
import { eventAdd } from '@redux/actions/apiActions/events';
import { clearEventCreationData } from '@redux/actions/contentData/events';
import { State, EventRequestState, EventCreationData, ProgramEntry } from '@ts/types';
import { Errors } from '@utils';

import type { EventAddScreenNavigationProp } from '.';
import EventAddPageContact from './components/AddContact';
import EventAddPageDuration from './components/AddDuration';
import EventAddPageGroup from './components/AddGroup';
import EventAddPageLocation from './components/AddLocation';
import EventAddPageMeta from './components/AddMeta';
import EventAddPagePlace from './components/AddPlace';
import EventAddPageProgram from './components/AddProgram';
import EventAddPageTags from './components/AddTags';
import getStyles from './styles';

type Props = {
  navigation: EventAddScreenNavigationProp<'Add'>;
  reqState: EventRequestState;
  creationData?: EventCreationData;
};

const EventAdd: React.FC<Props> = ({ navigation, reqState, creationData = {} }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const scrollViewRef = React.useRef<ScrollView>(null);

  const add = (
    parser?: 'markdown' | 'plaintext',
    description?: string,
    program?: ProgramEntry[],
  ) => {
    eventAdd({
      title: creationData.title,
      summary: creationData.summary,
      data: description || creationData.description,
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
      parser: parser || creationData.parser,
      image: creationData.image,
      preferences: {
        comments: true,
      },
      tags: creationData.tags,
      program: program || creationData.program,
    })
      .then(({ _id }) => {
        navigation.replace('Success', { id: _id, creationData });
        clearEventCreationData();
      })
      .catch((error) => {
        Errors.showPopup({
          type: 'axios',
          what: 'la connexion',
          error,
          retry: () => add(parser, description, program),
        });
      });
  };

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
              <Text style={styles.title}>Créer un évènement</Text>
            </View>
            <StepperView
              onChange={() => scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })}
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
                  key: 'duration',
                  icon: 'clock',
                  title: 'Durée',
                  component: (props) => <EventAddPageDuration {...props} />,
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
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { events, eventData } = state;
  return { creationData: eventData.creationData, reqState: events.state };
};

export default connect(mapStateToProps)(EventAdd);
