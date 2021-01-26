import moment from 'moment';
import React from 'react';
import { View, Platform } from 'react-native';
import { Button, IconButton, List, Text } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { connect } from 'react-redux';

import { StepperViewPageProps, InlineCard } from '@components/index';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { Account, State, EventCreationData, ProgramEntry, EventRequestState } from '@ts/types';
import { useTheme } from '@utils/index';

import getAuthStyles from '../styles/Styles';
import ProgramAddModal from './ProgramAddModal';

type Props = StepperViewPageProps & {
  account: Account;
  creationData?: EventCreationData;
  add: (eventProgram: ProgramEntry[]) => void;
  state: EventRequestState;
};

const EventAddPageProgram: React.FC<Props> = ({ prev, add, account, creationData, state }) => {
  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);
  const [isProgramAddModalVisible, setProgramAddModalVisible] = React.useState(false);
  const [startDateShow, setStartDateShow] = React.useState(false);
  const [startTimeShow, setStartTimeShow] = React.useState(false);
  const [eventProgram, setProgram] = React.useState<ProgramEntry[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(new Date(0));

  const dismissStartDateModal = React.useCallback(() => {
    setStartDateShow(false);
  }, [setStartDateShow]);
  const dismissStartTimeModal = React.useCallback(() => {
    setStartTimeShow(false);
  }, [setStartTimeShow]);
  const showStartDateModal = () => {
    console.log('Hello from show');
    console.log(moment(creationData?.start).startOf('day'));
    console.log(moment(creationData?.end).startOf('day'));
    if (
      moment(creationData?.start).startOf('day').valueOf() !==
      moment(creationData?.end).startOf('day').valueOf()
    ) {
      setStartDateShow(true);
    } else {
      changeStartDate({ date: moment(creationData?.start).startOf('day') });
    }
  };
  const submit = () => {
    updateEventCreationData({ program: eventProgram });
    add(eventProgram);
  };
  const addProgram = (program: ProgramEntry) => {
    setProgram([...eventProgram, program]);
    setStartDate(new Date(0));
  };

  const changeStartDate = React.useCallback(({ date }) => {
    setStartDateShow(false);
    setStartTimeShow(true);
    setStartDate(date);
  }, []);

  const changeStartTime = ({ hours, minutes }: { hours: number; minutes: number }) => {
    const currentDate = new Date(startDate.valueOf() + 3.6e6 * hours + 6e4 * minutes);
    setStartTimeShow(false);
    setStartDate(currentDate);
    setProgramAddModalVisible(true);
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
      <View style={{ marginTop: 30 }}>
        <List.Subheader> Progamme </List.Subheader>
        {eventProgram?.map((program) => (
          <View
            key={program._id}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={{ flexGrow: 1, width: 250, marginRight: 20 }}>
              <InlineCard
                key={program._id}
                icon="timetable"
                title={program.title}
                subtitle={`${moment(program.duration?.start).format('ddd D H:mm')} à ${moment(
                  program.duration?.end,
                ).format('ddd D H:mm')}`}
              />
            </View>
            <View style={{ flexGrow: 1 }}>
              <IconButton
                icon="delete"
                size={30}
                style={{ marginRight: 20, flexGrow: 1 }}
                onPress={() => {
                  setProgram(eventProgram.filter((s) => s !== program));
                }}
              />
            </View>
          </View>
        ))}
      </View>
      <View style={styles.container}>
        <Button
          mode="outlined"
          uppercase={Platform.OS !== 'ios'}
          onPress={() => {
            setProgramAddModalVisible(true);
          }}
        >
          Ajouter
        </Button>
      </View>
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
      <ProgramAddModal
        visible={isProgramAddModalVisible}
        setVisible={setProgramAddModalVisible}
        date={startDate}
        resetDate={() => setStartDate(new Date(0))}
        setDate={() => showStartDateModal()}
        add={(program) => {
          addProgram(program);
        }}
      />
      <View style={{ height: 30 }} />
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
          onPress={() => submit()}
          style={{ flex: 1, marginLeft: 5 }}
          loading={state.add?.loading}
        >
          Publier
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, events, eventData } = state;
  return { account, state: events.state, creationData: eventData.creationData };
};

export default connect(mapStateToProps)(EventAddPageProgram);
