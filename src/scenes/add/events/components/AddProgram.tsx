import React from 'react';
import { View, Platform, TextInput as RNTestInput } from 'react-native';
import { connect } from 'react-redux';
import { Button, Text, Title } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Account, Content, State } from '@ts/types';
import { StepperViewPageProps } from '@components/index';
import { useTheme } from '@utils/index';
import getStyles from '@styles/Styles';
import { updateEventCreationData } from '@redux/actions/contentData/events';

import ProgramAddModal from './ProgramAddModal';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & { account: Account; add: (parser: Content['parser']) => void };

const EventAddPageProgram: React.FC<Props> = ({ prev, add, account }) => {
  const contentInput = React.createRef<RNTestInput>();
  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);
  const [isProgramAddModalVisible, setProgramAddModalVisible] = React.useState(false);
  const [program, setProgram] = React.useState<ProgramType[]>([]);
  const submit = () => {
    updateEventCreationData({ parser: 'markdown', program: null });
    add('markdown');
  };

  type ProgramType = {
    _id: string;
    title: string;
    duration: Duration,
    description?: {
      parser?: string;
      data: string;
    };
    address?: Address;
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
        <FlatList
          keyExtractor={(program) => program._id}
          data={program}
          renderItem={({ item: program }) => {
            return (
              <InlineCard
                icon="at"
                title={program.value}
                subtitle={program.key}
                onPress={() => {
                  setProgram(program.filter((s) => s !== program));
                }}
              />
            );
          }}
        />
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
      <View style={eventStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={prev}
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
