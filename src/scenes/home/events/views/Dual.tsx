import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View, Text } from 'react-native';
import { Subheading } from 'react-native-paper';

import { Illustration } from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils/index';

import EventDisplay from '../../../display/events/views/Display';
import { HomeTwoNavParams } from '../../HomeTwo';
import EventList from './List';

type EventListDualProps = StackScreenProps<HomeTwoNavParams, 'Article'>;

const EventListDual: React.FC<EventListDualProps> = ({ navigation, route }) => {
  const [event, setEvent] = React.useState<{
    id: string;
    title: string;
    useLists: boolean;
  } | null>(null);
  const [visible, setVisible] = React.useState(true);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flexGrow: 1, flex: 1 }}>
        <EventList
          navigation={navigation}
          route={route}
          dual
          setEvent={(e) => {
            setEvent(e);
            setVisible(false);
            setTimeout(() => setVisible(true), 1);
          }}
        />
      </View>
      <View style={{ backgroundColor: colors.disabled, width: 1 }} />
      <View style={{ flexGrow: 2, flex: 1 }}>
        {event ? (
          <EventDisplay
            navigation={navigation}
            route={{
              params: {
                id: event.id,
                title: event.title,
                useLists: event.useLists,
                verification: false,
              },
            }}
            dual
          />
        ) : !visible ? null : (
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="event" width={500} height={500} />
            <Subheading>Séléctionnez un évènement</Subheading>
          </View>
        )}
      </View>
    </View>
  );
};

export default EventListDual;
