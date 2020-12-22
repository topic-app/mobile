import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
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
  const [startDateShow, setStartDateShow] = React.useState(false);
  const [endDateShow, setEndDateShow] = React.useState(false);
  const [startTimeShow, setStartTimeShow] = React.useState(false);
  const [endTimeShow, setEndTimeShow] = React.useState(false);
  const dismissStartDateModal = React.useCallback(() => {
    setStartDateShow(false);
  }, [setStartDateShow]);
  const dismissEndDateModal = React.useCallback(() => {
    setEndDateShow(false);
  }, [setEndDateShow]);
  const dismissStartTimeModal = React.useCallback(() => {
    setStartTimeShow(false);
  }, [setStartTimeShow]);
  const dismissEndTimeModal = React.useCallback(() => {
    setEndTimeShow(false);
  }, [setEndTimeShow]);
  const showStartDateModal = () =>{
    setStartDateShow(true);
  };
  const showEndDateModal = () =>{
    setEndDateShow(true);
  };

  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const changeStartDate = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setStartDateShow(false);
    setStartTimeShow(true);
    setStartDate(currentDate);
    checkErrors();
    if (currentDate && endDate && currentDate.valueOf() >= endDate.valueOf()) {
        setEndDate(currentDate);
      }
  };

  const changeStartTime = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setStartTimeShow(false);
    setStartDate(currentDate);
    checkErrors();
    if (currentDate && endDate && currentDate.valueOf() >= endDate.valueOf()) {
        setEndDate(currentDate);
      }
  };

  const changeEndDate = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setEndDateShow(false);
    setEndTimeShow(true);
    setEndDate(currentDate);
    checkErrors();
  };

  const changeEndTime = (event: unknown, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setEndTimeShow(false);
    setEndDate(currentDate);
    checkErrors();
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
            onPress={showStartDateModal}
            style={{ marginHorizontal: 5 }}
            uppercase={false}
          >
            {startDate === null ? 'Appuyez pour sélectionner' : moment(startDate).format('LLL')}
          </Button>
          <DatePickerModal
            mode="single"
            visible={startDateShow}
            onDismiss={dismissStartDateModal}
            date={startDate}
            onConfirm={changeStartDate}
            saveLabel="Enregistrer"
            label="Choisissez une date"
          />
          <TimePickerModal
            visible={startTimeShow}
            onDismiss={dismissStartTimeModal}
            onConfirm={changeStartTime}
            label="Choisissez l'heure de début"
            cancelLabel="Annuler"
            confirmLabel="Enregistrer"
          />
        </View>
        <List.Subheader> Fin de l&apos;évènement </List.Subheader>
        <HelperText type="error" visible={showError} style={{ marginVertical: -10 }}>
          Votre évènement doit durer un heure au minimum.
        </HelperText>
        <View style={styles.container}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={false}
            onPress={showEndDateModal}
            style={{ marginHorizontal: 5 }}
          >
            {endDate === null ? 'Appuyez pour sélectionner' : moment(endDate).format('LLL')}
          </Button>
          <DatePickerModal
            mode="single"
            visible={endDateShow}
            onDismiss={dismissEndDateModal}
            date={endDate}
            onConfirm={changeEndDate}
            saveLabel="Enregistrer"
            label="Choisissez une date"
          />
          <TimePickerModal
            visible={endTimeShow}
            onDismiss={dismissEndTimeModal}
            onConfirm={changeEndTime}
            label="Choisissez l'heure de fin"
            cancelLabel="Annuler"
            confirmLabel="Enregistrer"
          />
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
