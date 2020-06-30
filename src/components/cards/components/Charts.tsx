import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import _ from 'lodash';

import getPetitionStyles from '../styles/PetitionStyles';
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
  const petitionStyles = getPetitionStyles(theme);
  const { votes, goal } = voteData;

  const getLeftSpacing = (vote) => {
    const offset = vote.toString().length * 2.5;
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
  const { colors } = useTheme();
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

function PetitionChart({ voteData }) {
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

export default PetitionChart;

PetitionChart.propTypes = {
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
};

PetitionOpinion.propTypes = PetitionChart.propTypes;
PetitionGoal.propTypes = PetitionChart.propTypes;
PetitionMultiple.propTypes = PetitionChart.propTypes;
PetitionSign.propTypes = PetitionChart.propTypes;
