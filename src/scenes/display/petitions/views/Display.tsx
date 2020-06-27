import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Platform } from 'react-native';
import {
  Text,
  Button,
  Divider,
  List,
  RadioButton,
  Card,
  Paragraph,
  Chip,
  useTheme,
} from 'react-native-paper';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import getStyles from '@styles/Styles';
import TagList from '@components/TagList';
import PetitionChart from '../components/Charts';

function StatusChip({ mode, color, icon, label }) {
  const theme = useTheme();
  const { colors } = theme;

  if (label === null) return null;

  let viewStyles;
  let textColor;

  switch (mode) {
    case 'text':
      viewStyles = {
        backgroundColor: 'transparent',
      };
      textColor = color;
      break;
    case 'outlined':
      viewStyles = {
        backgroundColor: colors.surface,
        borderWidth: 0.7,
        borderColor: color,
      };
      textColor = color;
      break;
    default:
      viewStyles = {
        backgroundColor: color,
        elevation: 1,
      };
      textColor = colors.surface;
  }

  return (
    <View
      style={{
        height: 25,
        paddingLeft: 4,
        paddingRight: 6,
        marginTop: 2,
        marginLeft: 4,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.roundness,
        ...viewStyles,
      }}
    >
      <MaterialCommunityIcons name={icon} color={textColor} size={17} />
      <Text style={{ color: textColor, fontSize: 13 }}> {label}</Text>
    </View>
  );
}

function renderPetitionStatus(status, theme) {
  const { colors } = theme;

  switch (status) {
    case 'answered':
      return <StatusChip color={colors.valid} icon="check" label="Réussite" />;
    case 'rejected':
      return <StatusChip mode="text" color={colors.disabled} icon="lock" label="Fermée" />;
    case 'open':
      return <StatusChip mode="outlined" color={colors.valid} icon="menu-open" label="Ouvert" />;
    default:
      return (
        <StatusChip mode="text" color={colors.disabled} icon="clock-outline" label="En Attente" />
      );
  }
}

function PetitionTime({ status: petitionStatus, startTime, endTime }) {
  const theme = useTheme();
  const styles = getStyles(theme);

  let status = petitionStatus;
  if (status === 'open' && moment().isAfter(endTime)) {
    status = 'waiting';
  }

  let message = `Terminée ${moment(endTime).fromNow()}`;
  if (status === 'open') {
    message = `Commencée ${moment(startTime).fromNow()}`;
  } else if (status === 'waiting') {
    message = `Fermée ${moment(endTime).fromNow()}`;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text style={[styles.subtitle, { width: '75%' }]} numberOfLines={1}>
        {message}
      </Text>
      <View style={{ position: 'absolute', right: 0 }}>{renderPetitionStatus(status, theme)}</View>
    </View>
  );
}

function PetitionDisplay({ route, petitions }) {
  const theme = useTheme();
  const { colors } = theme;
  const { id } = route.params;
  const petition = petitions.find((t) => t._id === id);

  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{petition.title}</Text>
          <PetitionTime
            status={petition.status}
            startTime={petition.duration.start}
            endTime={petition.duration.end}
          />
        </View>
        <View style={{ paddingBottom: 5, paddingTop: 2 }}>
          <TagList item={petition} />
        </View>
        <View
          style={
            (petition.voteData.type === 'goal' || petition.voteData.type === 'sign') && {
              paddingHorizontal: 20,
              paddingTop: 5,
            }
          }
        >
          <PetitionChart voteData={petition.voteData} />
        </View>
        <View style={styles.contentContainer}>
          <Text>{petition.description}</Text>
        </View>
        <Divider />
        <View style={styles.contentContainer}>
          <List.Item
            title="Espace lecture"
            left={() =>
              Platform.OS !== 'ios' ? (
                <RadioButton status="unchecked" color="green" onPress={() => {}} />
              ) : null
            }
            onPress={() => {}}
          />
          <List.Item
            title="Aide au devoirs"
            left={() =>
              Platform.OS !== 'ios' ? (
                <RadioButton status="unchecked" color="yellow" onPress={() => {}} />
              ) : null
            }
            onPress={() => {}}
          />
          <List.Item
            title="FabLab"
            left={() =>
              Platform.OS !== 'ios' ? (
                <RadioButton status="checked" color="#962626" onPress={() => {}} />
              ) : null
            }
            onPress={() => {}}
          />
          <List.Item
            title="Matériel informatique"
            left={() =>
              Platform.OS !== 'ios' ? (
                <RadioButton status="unchecked" color="blue" onPress={() => {}} />
              ) : null
            }
            onPress={() => {}}
          />
        </View>
        <View style={styles.contentContainer}>
          <Button mode="contained">Voter</Button>
        </View>
        <Divider />
        <Card style={[styles.card, { marginBottom: 10 }]}>
          <View style={{ paddingTop: 10, paddingBottom: 5 }}>
            <Card.Content>
              <Text style={styles.cardTitle}>
                <MaterialCommunityIcons name="comment" />
                &nbsp;Administration CIV
              </Text>
            </Card.Content>
            <Card.Content style={{ marginTop: 5 }}>
              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    margin: 10,
                    marginTop: 0,
                    marginLeft: 15,
                    flex: 1,
                  }}
                >
                  <Text style={styles.subtitle}>Message de l&apos;auteur</Text>
                  <Paragraph style={styles.text}>
                    Bonne nouvelle : la région finance la création de cet espace et nous pouvons
                    donc inclure plusieurs éléments. Nous attendrons que ce sondage soit fini pour
                    prendre notre décision
                  </Paragraph>
                </View>
              </View>
            </Card.Content>
          </View>
        </Card>
        <Divider />
        <List.Item
          title="Écrire un commentaire"
          titleStyle={{ color: colors.disabled }}
          right={() => <List.Icon icon="send" />}
        />
        <Divider />
        <View style={styles.contentContainer}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Chip mode="flat" icon="account" style={{ width: 185, marginRight: 5 }}>
                Tom Ruchier-Berquet
              </Chip>
              <Chip mode="outlined" style={{ width: 100, marginRight: 5 }}>
                CVL du CIV
              </Chip>
              <Chip mode="outlined" style={{ width: 95, marginRight: 5 }}>
                Asso JTAC
              </Chip>
              <Chip mode="outlined" style={{ width: 70, marginRight: 5 }}>
                CNVL
              </Chip>
            </View>
            <MaterialCommunityIcons name="dots-vertical" size={25} />
          </View>
          <View style={styles.contentContainer}>
            <Paragraph>
              Merci pour votre soutien! En tant que membre de la CVL je fais le plus possible pour
              mener à l&apos;aboutissement de ce projet
            </Paragraph>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  const { petitions } = state;
  return { petitions: petitions.data, state: petitions.state };
};

export default connect(mapStateToProps)(PetitionDisplay);

PetitionDisplay.propTypes = {
  state: PropTypes.shape({
    success: PropTypes.bool,
    loading: PropTypes.shape({
      next: PropTypes.bool,
      initial: PropTypes.bool,
      refresh: PropTypes.bool,
    }),
    error: PropTypes.shape(),
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  petitions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      voteData: PropTypes.shape({
        type: PropTypes.string.isRequired,
        goal: PropTypes.number,
        votes: PropTypes.number,
        against: PropTypes.number,
        for: PropTypes.number,
        multiple: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            votes: PropTypes.number,
          }),
        ),
      }).isRequired,
      status: PropTypes.oneOf(['open', 'waiting', 'rejected', 'answered']),
      duration: PropTypes.shape({
        start: PropTypes.string.isRequired, // Note: need to change to instanceOf(Date) once we get axios working
        end: PropTypes.string.isRequired,
      }).isRequired,
      description: PropTypes.string,
    }).isRequired,
  ).isRequired,
};

PetitionTime.propTypes = {
  status: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
};

StatusChip.propTypes = {
  mode: PropTypes.oneOf(['contained', 'text', 'outlined']),
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.string,
};

StatusChip.defaultProps = {
  mode: 'contained',
  icon: null,
};
