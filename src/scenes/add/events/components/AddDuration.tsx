import moment from 'moment';
import React from 'react';
import { View, Platform } from 'react-native';
import { Button, HelperText, List, Text } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { connect } from 'react-redux';

import { StepperViewPageProps } from '@components/index';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { Account, State } from '@ts/types';
import { useTheme } from '@utils/index';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & { account: Account };

const EventAddPageDuration: React.FC<Props> = ({ next, prev, account }) => {
  const [errorVisible, setErrorVisible] = React.useState(false);
  const [showError, setError] = React.useState(false);

  const [startDate, setStartDate] = React.useState<moment.Moment | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<moment.Moment | undefined>(undefined);

  const [startDateShow, setStartDateShow] = React.useState(false);
  const [endDateShow, setEndDateShow] = React.useState(false);
  const [startTimeShow, setStartTimeShow] = React.useState(false);
  const [endTimeShow, setEndTimeShow] = React.useState(false);

  const dismissStartDateModal = () => {
    setStartDateShow(false);
  };
  const dismissEndDateModal = () => {
    setEndDateShow(false);
  };
  const dismissStartTimeModal = () => {
    setStartTimeShow(false);
  };
  const dismissEndTimeModal = () => {
    setEndTimeShow(false);
  };
  const showStartDateModal = () => {
    setStartDateShow(true);
  };
  const showEndDateModal = () => {
    setEndDateShow(true);
  };

  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const changeStartDate = ({ date }: { date: Date | undefined }) => {
    if (date) {
      setStartDateShow(false);
      setStartTimeShow(true);
      setStartDate(moment(date));
      // if (newDate.isSameOrAfter(endDate)) {
      //   setEndDate(newDate);
      // }
    }
    checkErrors();
  };

  const changeStartTime = ({ hours, minutes }: { hours: number; minutes: number }) => {
    if (startDate) {
      const newDate = startDate.add(hours, 'hours').add(minutes, 'minutes');
      setStartTimeShow(false);
      setStartDate(newDate);
      // if (newDate.isSameOrAfter(endDate)) {
      //   setEndDate(newDate);
      // }
    }
    checkErrors();
  };

  const changeEndDate = ({ date }: { date: Date | undefined }) => {
    if (date) {
      setEndDateShow(false);
      setEndTimeShow(true);
      setEndDate(moment(date));
    }
    checkErrors();
  };

  const changeEndTime = ({ hours, minutes }: { hours: number; minutes: number }) => {
    if (endDate) {
      const newDate = endDate.add(hours, 'hours').add(minutes, 'minutes');
      setEndTimeShow(false);
      setEndDate(newDate);
    }
    checkErrors();
  };

  const checkErrors = () => {
    if (startDate && endDate) {
      setErrorVisible(false);
      if (moment(startDate).add(1, 'hour').isBefore(endDate)) {
        setError(false);
      }
    }
  };

  const submit = () => {
    if (startDate && endDate && moment(startDate).add(1, 'hour').isBefore(endDate)) {
      updateEventCreationData({ start: startDate.toDate(), end: endDate.toDate() });
      next();
    } else {
      if (!startDate || !endDate) {
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
            {startDate ? startDate.format('LLL') : 'Appuyez pour sélectionner'}
          </Button>
          <DatePickerModal
            mode="single"
            visible={startDateShow}
            onDismiss={dismissStartDateModal}
            date={moment(startDate).toDate()}
            onConfirm={changeStartDate}
            saveLabel="Suivant"
            label="Choisissez la date de début"
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
          Votre évènement doit durer une heure au minimum
        </HelperText>
        <View style={styles.container}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={false}
            onPress={showEndDateModal}
            style={{ marginHorizontal: 5 }}
          >
            {endDate ? endDate.format('LLL') : 'Appuyez pour sélectionner'}
          </Button>
          <DatePickerModal
            mode="single"
            visible={endDateShow}
            onDismiss={dismissEndDateModal}
            date={moment(endDate).toDate()}
            onConfirm={changeEndDate}
            saveLabel="Suivant"
            label="Choisissez la date de fin"
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
          Vous devez sélectionner une date de début et de fin
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
