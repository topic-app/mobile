import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Platform, Alert } from 'react-native';
import { Button, RadioButton, HelperText, List, Text, useTheme, Card } from 'react-native-paper';

import { updateEventCreationData } from '@redux/actions/contentData/events';
import { StepperViewPageProps } from '@components/index';
import { Account, State } from '@ts/types';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomTabView } from '@components/index';

import getAuthStyles from '../styles/Styles';
import { connect } from 'react-redux';
import { ListHeading } from '@root/src/scenes/auth/components/ListComponents';
import { ListItem } from '@root/src/scenes/more/list/components/ListComponents';

type Props = StepperViewPageProps & { account: Account };

const EventAddPageDuration: React.FC<Props> = ({ next, prev, account }) => {
  const [showError, setError] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const [startMode, setStartMode] = React.useState('time');
  const [endMode, setEndMode] = React.useState('time');
  const [startShow, setStartShow] = React.useState(false);
  const [endShow, setEndShow] = React.useState(false);

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const changeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setStartShow(false);
    setStartDate(currentDate);
    startMode === 'date' ? showStartMode() : currentDate > endDate && setEndDate(currentDate);
  };

  const showStartMode = () => {
    startMode === 'time' ? setStartMode('date') : setStartMode('time');
    setStartShow(true);
  };

  const changeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndShow(false);
    setEndDate(currentDate);
    endMode === 'date' && showEndMode();
  };

  const showEndMode = () => {
    endMode === 'time' ? setEndMode('date') : setEndMode('time');
    setEndShow(true);
  };

  const submit = () => {
    updateEventCreationData({ start: startDate, end: endDate });
    next();
  };

  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];

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
        <List.Subheader> Début de l'évènement </List.Subheader>
        <View style={styles.container}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            onPress={showStartMode}
            style={{ marginHorizontal: 5 }}
            uppercase={false}
          >
            {startDate.getDate()} {months[startDate.getMonth()]} {startDate.getFullYear()} à{' '}
            {startDate.getHours() < 10 ? `0${startDate.getHours()}` : startDate.getHours()}h
            {startDate.getMinutes() < 10 ? `0${startDate.getMinutes()}` : startDate.getMinutes()}
          </Button>
          {startShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate}
              mode={startMode}
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={Date.now()}
              onChange={changeStartDate}
            />
          )}
        </View>
        <List.Subheader> Fin de l'évènement </List.Subheader>
        <View style={styles.container}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={false}
            onPress={showEndMode}
            style={{ marginHorizontal: 5 }}
          >
            {endDate.getDate()} {months[endDate.getMonth()]} {endDate.getFullYear()} à{' '}
            {endDate.getHours() < 10 ? `0${endDate.getHours()}` : endDate.getHours()}h
            {endDate.getMinutes() < 10 ? `0${endDate.getMinutes()}` : endDate.getMinutes()}
          </Button>
          {endShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate}
              mode={endMode}
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={changeEndDate}
              minimumDate={startDate}
            />
          )}
        </View>
      </View>
      <View style={{ height: 50 }} />
      <View style={eventStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => prev()}
          style={{ flex: 1, margin: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={submit}
          style={{ flex: 1, margin: 5 }}
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
