import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { View, Platform, TextInput as RNTestInput, FlatList } from 'react-native';
import { TextInput, Button, IconButton, List, Text } from 'react-native-paper';
import { connect } from 'react-redux';

import { StepperViewPageProps, InlineCard } from '@components/index';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import {
  Account,
  Content,
  State,
  Duration,
  Address,
  EventCreationData,
  ProgramEntry,
} from '@ts/types';
import { useTheme } from '@utils/index';

import getAuthStyles from '../styles/Styles';
import ProgramAddModal from './ProgramAddModal';

type Props = StepperViewPageProps & {
  account: Account;
  creationData?: EventCreationData;
  add: (parser: Content['parser']) => void;
};

const EventAddPageProgram: React.FC<Props> = ({ prev, add, account, creationData }) => {
  const contentInput = React.createRef<RNTestInput>();
  const theme = useTheme();
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);
  const [isProgramAddModalVisible, setProgramAddModalVisible] = React.useState(false);
  const [isDateTimePickerVisible, setDateTimePickerVisible] = React.useState(false);
  const [startMode, setStartMode] = React.useState<'time' | 'date'>('time');
  const [eventProgram, setProgram] = React.useState<ProgramEntry[]>([]);
  const [startDate, setStartDate] = React.useState<Date>(new Date(0));
  const submit = () => {
    updateEventCreationData({ parser: 'markdown', program: eventProgram });
    add('markdown');
  };
  const addProgram = (program: ProgramEntry) => {
    setProgram([...eventProgram, program]);
    setStartDate(new Date(0));
  };

  const changeStartDate = (event: unknown, date?: Date) => {
    const currentDate = date || startDate;
    setDateTimePickerVisible(false);
    setStartDate(currentDate);
    if (startMode === 'date') {
      showStartMode();
    } else {
      setDateTimePickerVisible(false);
      setProgramAddModalVisible(true);
    }
  };

  const showStartMode = () => {
    startDate === null && setStartDate(new Date());
    startMode === 'time' ? setStartMode('date') : setStartMode('time');
    setDateTimePickerVisible(true);
  };

  function blurInputs() {
    contentInput.current?.blur();
  }

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
              <InlineCard key={program._id} icon="timetable" title={program.title} />
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
      {isDateTimePickerVisible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          mode={startMode}
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          minimumDate={creationData?.start ? new Date(creationData.start) : new Date()}
          onChange={changeStartDate}
        />
      )}
      <ProgramAddModal
        visible={isProgramAddModalVisible}
        setVisible={setProgramAddModalVisible}
        date={startDate}
        resetDate={() => setStartDate(new Date(0))}
        setDate={() => showStartMode()}
        add={(program) => {
          addProgram(program);
        }}
      />
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
          onPress={() => {
            blurInputs();
            submit();
          }}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Publier
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPageProgram);
