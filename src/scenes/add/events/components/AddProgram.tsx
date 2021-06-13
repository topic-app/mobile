import { Formik } from 'formik';
import moment from 'moment';
import React, { createRef } from 'react';
import { View, Platform, TextInput as RNTextInput } from 'react-native';
import { Button, IconButton, List, Text, useTheme } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import { StepperViewPageProps, InlineCard, FormTextInput } from '@components';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import { Account, State, EventCreationData, ProgramEntry, EventRequestState } from '@ts/types';

import getStyles from '../styles';
import ProgramAddModal from './ProgramAddModal';

type Props = StepperViewPageProps & {
  account: Account;
  creationData?: EventCreationData;
  add: (
    parser: 'markdown' | 'plaintext',
    description: string,
    eventProgram: ProgramEntry[],
  ) => void;
  state: EventRequestState;
};

const EventAddPageProgram: React.FC<Props> = ({ prev, add, account, creationData = {}, state }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isProgramAddModalVisible, setProgramAddModalVisible] = React.useState(false);
  const [startDateShow, setStartDateShow] = React.useState(false);
  const [startTimeShow, setStartTimeShow] = React.useState(false);
  const [eventProgram, setProgram] = React.useState<ProgramEntry[]>([]);
  const [startDate, setStartDate] = React.useState<moment.Moment | undefined>(undefined);

  const dismissStartDateModal = React.useCallback(() => {
    setStartDateShow(false);
  }, [setStartDateShow]);
  const dismissStartTimeModal = React.useCallback(() => {
    setStartTimeShow(false);
  }, [setStartTimeShow]);
  const showStartDateModal = () => {
    if (moment(creationData.start).isSame(creationData.end, 'day')) {
      setStartDateShow(true);
    } else {
      changeStartDate({ date: moment(creationData.start).toDate() });
    }
  };
  const addProgram = (program: ProgramEntry) => {
    setProgram([...eventProgram, program]);
    setStartDate(undefined);
  };

  const changeStartDate = React.useCallback(({ date }: { date?: Date }) => {
    setStartDateShow(false);
    setStartTimeShow(true);
    if (date) setStartDate(moment(date));
  }, []);

  const changeStartTime = ({ hours, minutes }: { hours: number; minutes: number }) => {
    if (startDate) {
      const newDate = moment(startDate).add(hours, 'hours').add(minutes, 'minutes');
      setStartTimeShow(false);
      setStartDate(newDate);
      setProgramAddModalVisible(true);
    }
  };

  const DescriptionSchema = Yup.object().shape({
    description: Yup.string().required('Description requise'),
  });
  const descriptionInput = createRef<RNTextInput>();

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
    <View style={styles.formContainer}>
      <Formik
        initialValues={{ description: '' }}
        validationSchema={DescriptionSchema}
        onSubmit={({ description }) => {
          updateEventCreationData({
            description,
            parser: 'markdown',
            program: eventProgram,
          });
          add('markdown', description, eventProgram);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ flex: 1 }}>
            <View style={{ marginTop: 30 }}>
              <FormTextInput
                ref={descriptionInput}
                label="Décrivez votre évènement..."
                multiline
                numberOfLines={8}
                value={values.description}
                touched={touched.description}
                error={errors.description}
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                onSubmitEditing={() => handleSubmit()}
                style={styles.textInput}
              />

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
                      accessibilityLabel="Supprimer cet élément"
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
              date={moment(startDate).toDate()}
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
              date={moment(startDate).toDate()}
              resetDate={() => setStartDate(undefined)}
              setDate={() => showStartDateModal()}
              add={(program) => {
                addProgram(program);
              }}
            />
            <View style={{ height: 30 }} />
            <View style={styles.buttonContainer}>
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
                onPress={() => handleSubmit()}
                style={{ flex: 1, marginLeft: 5 }}
                loading={state.add?.loading}
              >
                Publier
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, events, eventData } = state;
  return { account, state: events.state, creationData: eventData.creationData };
};

export default connect(mapStateToProps)(EventAddPageProgram);
