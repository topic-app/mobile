import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Platform } from 'react-native';
import { Button, RadioButton, HelperText, List, Text, useTheme, Card } from 'react-native-paper';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import { StepperViewPageProps } from '@components/index';
import { Account, State } from '@ts/types';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomTabView } from '@components/index';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';

type Props = StepperViewPageProps & { account: Account };

const EventAddPageDuration: React.FC<Props> = ({ next, prev, account }) => {
  const [showError, setError] = React.useState(false);
  const [date, setDate] = React.useState(new Date(1598051730000));
  const [mode, setMode] = React.useState('date');
  const [show, setShow] = React.useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const submit = () => {
    {
      /* updateEventCreationData({ tags: selectedTags }); */
    }
    next();
  };

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }
  return (
    <View>
      <View>
        <CustomTabView
          scrollEnabled={false}
          pages={[
            {
              key: 'beginning',
              title: 'Début',
              component: (
                <View style={styles.container}>
                  <Button
                    mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={showDatepicker}
                    style={{ marginRight: 5 }}
                  >
                    Date
                  </Button>
                  <Button
                    mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={showTimepicker}
                  >
                    Heure
                  </Button>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>
              ),
            },
            {
              key: 'end',
              title: 'Fin',
              component: (
                <View style={styles.container}>
                  <Button
                    mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={showDatepicker}
                    style={{ marginRight: 5 }}
                  >
                    Date
                  </Button>
                  <Button
                    mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={showTimepicker}
                  >
                    Heure
                  </Button>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>
              ),
            },
          ]}
        />
      </View>
      <View style={{ height: 50 }} />
      <View style={eventStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => prev()}
          style={{ flex: 1, marginRight: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={submit}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPageDuration);
