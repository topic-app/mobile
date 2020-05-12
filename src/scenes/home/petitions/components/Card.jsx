/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, ProgressBar, Text, useTheme } from 'react-native-paper';
import moment from 'moment';
import _ from 'lodash';

import TagList from '@components/TagList';
import getStyles from '@styles/Styles';
import getPetitionStyles from '../styles/Styles';
import MultiVote from './MultiVote';

function PetitionSign({ voteData }) {
  const petitionStyles = getPetitionStyles(useTheme());
  return (
    <Text style={[petitionStyles.signText, { fontWeight: 'bold' }]}>
      {voteData.votes} signatures
    </Text>
  );
}

function PetitionGoal({ voteData }) {
  const theme = useTheme();
  const { colors } = theme;
  const petitionStyles = getPetitionStyles(useTheme());
  const { votes, goal } = voteData;

  const getLeftSpacing = (vote) => {
    const offset = 7;
    // Return left spacing in percentage while making sure it stays in between 0% and 90%
    return `${_.clamp(Math.round((vote / goal) * 100 - offset), 0, 90)}%`;
  };

  return (
    <View>
      <View style={petitionStyles.progressContainer}>
        <ProgressBar
          style={[petitionStyles.progress, petitionStyles.progressRadius]}
          progress={votes / goal}
        />
        <Text style={[petitionStyles.voteLabel, { left: getLeftSpacing(votes) }]}>{votes}</Text>
        <Text style={{ position: 'absolute', right: 0, top: -24, color: colors.subtitle }}>
          {goal}
        </Text>
      </View>
      <Text style={petitionStyles.signText}>
        <Text style={{ fontWeight: 'bold' }}>{votes}</Text> / {goal} signatures
      </Text>
    </View>
  );
}

function PetitionMultiple({ voteData }) {
  const { colors } = useTheme();
  return <MultiVote items={voteData.opinions} barColors={Object.values(colors.solid)} />;
}

function PetitionOpinion({ voteData }) {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View>
      <MultiVote
        items={[
          { title: 'Pour', votes: voteData.for },
          { title: 'Contre', votes: voteData.against },
        ]}
        barColors={[colors.valid, colors.error]}
        showAllLabels
      />
    </View>
  );
}

function renderPetitionVote(voteData) {
  switch (voteData.type) {
    case 'sign':
      return <PetitionSign voteData={voteData} />;
    case 'goal':
      return <PetitionGoal voteData={voteData} />;
    case 'opinion':
      return <PetitionOpinion voteData={voteData} />;
    case 'multiple':
      return <PetitionMultiple voteData={voteData} />;
    default:
      return (
        <View>
          <Text>Unknown Petition Type</Text>
        </View>
      );
  }
}

function getShortTime(time) {
  // If time is in the past
  if (moment(time).isBefore()) {
    return null;
  }
  // If time is within 1 hour
  if (moment(time).isBefore(moment().add(1, 'hour'))) {
    return `${moment(time).diff(moment(), 'minutes')} min`;
  }
  // If time is within 1 day
  if (moment(time).isBefore(moment().add(1, 'day'))) {
    return `${moment(time).diff(moment(), 'hours')} h`;
  }
  if (moment(time).isBefore(moment().add(1, 'month'))) {
    return `${moment(time).diff(moment(), 'hours')} j`;
  }
  if (moment(time).isBefore(moment().add(1, 'year'))) {
    return `${moment(time).diff(moment(), 'months')} mois`;
  }
  return `${moment(time).diff(moment(), 'years')} ans`;
}

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
    default:
      return (
        <StatusChip mode="text" color={colors.disabled} icon="clock-outline" label="En Attente" />
      );
  }
}

function PetitionComponentListCard({ navigate, petition }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

  const endTime = getShortTime(petition.duration.end);

  return (
    <Card style={styles.card}>
      <Touchable onPress={navigate}>
        <View style={{ paddingTop: 10, paddingBottom: 5 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle} numberOfLines={3}>
                  {petition.title}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {petition.status === 'open' && endTime ? (
                  <StatusChip
                    mode="text"
                    color={colors.disabled}
                    icon="clock-outline"
                    label={endTime}
                  />
                ) : (
                  renderPetitionStatus(petition.status, theme)
                )}
              </View>
            </View>

            {renderPetitionVote(petition.voteData)}
          </Card.Content>

          <Card.Content style={{ marginTop: 5, paddingHorizontal: 0 }}>
            <TagList type="petition" item={petition} />
          </Card.Content>
        </View>
      </Touchable>
    </Card>
  );
}

export default PetitionComponentListCard;

const voteDataPropType = PropTypes.shape({
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
});

PetitionComponentListCard.propTypes = {
  petition: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    voteData: voteDataPropType.isRequired,
    status: PropTypes.oneOf(['open', 'waiting', 'rejected', 'answered']),
    duration: PropTypes.shape({
      start: PropTypes.string.isRequired, // Note: need to change to instanceOf(Date) once we get axios working
      end: PropTypes.string.isRequired,
    }).isRequired,
    description: PropTypes.string,
    objective: PropTypes.string,
    votes: PropTypes.string,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};

PetitionOpinion.propTypes = { voteData: voteDataPropType.isRequired };

PetitionGoal.propTypes = PetitionOpinion.propTypes;
PetitionSign.propTypes = PetitionOpinion.propTypes;
PetitionMultiple.propTypes = PetitionOpinion.propTypes;

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
