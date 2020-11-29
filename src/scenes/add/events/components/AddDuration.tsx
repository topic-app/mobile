import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Platform } from 'react-native';
import { Button, HelperText, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import moment from 'moment';

import { Account, State } from '@ts/types';
import { StepperViewPageProps } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { updateEventCreationData } from '@redux/actions/contentData/events';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & { account: Account };

const EventAddPageDuration: React.FC<Props> = ({ next, prev, account }) => {
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [showError, setError] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date|null>(null);
  const [endDate, setEndDate] = React.useState<Date|null>(null);
  const [startMode, setStartMode] = React.useState<'date'|'time'>('time');
  const [endMode, setEndMode] = React.useState<'date'|'time'>('time');
  const [startShow, setStartShow] = React.useState(false);
  const [endShow, setEndShow] = React.useState(false);

  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const changeStartDate = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setStartShow(false);
    setStartDate(currentDate);
    if (startMode === 'date') {
      showStartMode();
    } else {
      checkErrors();
      if (currentDate && endDate && currentDate.valueOf() >= endDate.valueOf()) {
        setEndDate(currentDate);
      }
    }
  };

  const showStartMode = () => {
    startDate === null && setStartDate(new Date());
    startMode === 'time' ? setStartMode('date') : setStartMode('time');
    setStartShow(true);
  };

  const changeEndDate = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setEndShow(false);
    setEndDate(currentDate);
    endMode === 'date' ? showEndMode() : checkErrors();
  };

  const showEndMode = () => {
    endDate === null && setEndDate(new Date());
    endMode === 'time' ? setEndMode('date') : setEndMode('time');
    setEndShow(true);
  };

  const checkErrors = () => {
    if (startDate && endDate) setErrorVisible(false);
    if (endDate && startDate && (endDate.valueOf() - startDate.valueOf()) >= 3.6) setError(false);
  };

  const submit = () => {
    if (startDate && endDate && (endDate.valueOf() - startDate.valueOf()) >= 360000) {
      updateEventCreationData({ start: startDate, end: endDate });
      next();
    } else {
      if (startDate === null || endDate === null) {
        setErrorVisible(true);
      } else {
        setError(true);
      }
    }
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
    <View style={eventStyles.formContainer}>
      <View>
        <List.Subheader> Début de l&apos;évènement </List.Subheader>
        <View style={styles.container}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            onPress={showStartMode}
            style={{ marginHorizontal: 5 }}
            uppercase={false}
          >
            {startDate === null ? 'Appuyez pour sélectionner' : moment(startDate).format('LLL')}
          </Button>
          {startShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={startDate as Date}
              mode={startMode}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={new Date()}
              onChange={changeStartDate}
            />
          )}
        </View>
        <List.Subheader> Fin de l&apos;évènement </List.Subheader>
        <HelperText type="error" visible={showError} style={{ marginVertical: -10 }}>
          Votre évènement doit durer un heure au minimum.
        </HelperText>
        <View style={styles.container}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={false}
            onPress={showEndMode}
            style={{ marginHorizontal: 5 }}
          >
            {endDate === null ? 'Appuyez pour sélectionner' : moment(endDate).format('LLL')}
          </Button>
          {endShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={endDate as Date}
              mode={endMode}
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={changeEndDate}
              minimumDate={startDate as Date}
            />
          )}
        </View>
      </View>
      <View style={{ marginVertical: 5 }}>
        <HelperText type="error" visible={errorVisible}>
          Vous devez sélectionner une date de début et de fin.
        </HelperText>
      </View>
      <View style={eventStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => prev()}
          style={{ flex: 1, marginHorizontal: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={submit}
          style={{ flex: 1, marginHorizontal: 5 }}
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
