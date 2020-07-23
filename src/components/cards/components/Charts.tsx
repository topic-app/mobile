import React from 'react';
import { View } from 'react-native';
import { Text, useTheme, ProgressBar } from 'react-native-paper';
import _ from 'lodash';

import {
  PetitionVoteData,
  PetitionVoteDataNoGoal,
  PetitionVoteDataGoal,
  PetitionVoteDataDouble,
  PetitionVoteDataMultiple,
  Petition,
} from '@ts/types';
import getPetitionStyles from '../styles/PetitionStyles';
import MultiVote from './MultiVote';

type PetitionNoGoalProps = { voteData: PetitionVoteDataNoGoal };

const PetitionNoGoal: React.FC<PetitionNoGoalProps> = ({ voteData }) => {
  const petitionStyles = getPetitionStyles(useTheme());
  return (
    <Text style={[petitionStyles.signText, { fontWeight: 'bold' }]}>
      {voteData.signatures} signatures
    </Text>
  );
};

type PetitionGoalProps = { voteData: PetitionVoteDataGoal };

const PetitionGoal: React.FC<PetitionGoalProps> = ({ voteData }) => {
  const theme = useTheme();
  const { colors } = theme;
  const petitionStyles = getPetitionStyles(theme);
  const { signatures, goals } = voteData;

  // TODO: Intermediate goals
  const endGoal = goals[goals.length - 1];

  const getLeftSpacing = (vote: number) => {
    // TODO: Fix offset, not displaying properly on high density devices
    const offset = vote.toString().length * 2.5;
    // Return left spacing in percentage while making sure it stays in between 0% and 90%
    return `${_.clamp(Math.round((vote / endGoal) * 100 - offset), 0, 90)}%`;
  };

  return (
    <View>
      <View style={petitionStyles.progressContainer}>
        <ProgressBar
          style={[petitionStyles.progress, petitionStyles.progressRadius]}
          progress={signatures / endGoal}
        />
        <Text style={[petitionStyles.voteLabel, { left: getLeftSpacing(signatures) }]}>
          {signatures}
        </Text>
        <Text style={{ position: 'absolute', right: 0, top: -24, color: colors.subtitle }}>
          {endGoal}
        </Text>
      </View>
      <Text style={petitionStyles.signText}>
        <Text style={{ fontWeight: 'bold' }}>{signatures}</Text> / {endGoal} signatures
      </Text>
    </View>
  );
};

type PetitionMultipleProps = { voteData: PetitionVoteDataMultiple };

const PetitionMultiple: React.FC<PetitionMultipleProps> = ({ voteData }) => {
  const { colors } = useTheme();
  return <MultiVote items={voteData.multiple} barColors={Object.values(colors.solid)} />;
};

type PetitionDoubleProps = { voteData: PetitionVoteDataDouble };

const PetitionDouble: React.FC<PetitionDoubleProps> = ({ voteData }) => {
  const { colors } = useTheme();
  return (
    <View>
      <MultiVote
        items={[
          { title: 'Pour', votes: voteData.double.for },
          { title: 'Contre', votes: voteData.double.against },
        ]}
        barColors={[colors.valid, colors.error]}
        showAllLabels
      />
    </View>
  );
};

type PetitionChartProps = {
  type: Petition['type'];
  voteData: PetitionVoteData;
};

const PetitionChart: React.FC<PetitionChartProps> = ({ type, voteData }) => {
  switch (type) {
    case 'sign':
      return <PetitionNoGoal voteData={voteData} />;
    case 'goal':
      return <PetitionGoal voteData={voteData} />;
    case 'opinion':
      return <PetitionDouble voteData={voteData} />;
    case 'multiple':
      return <PetitionMultiple voteData={voteData} />;
    default:
      return (
        <View>
          <Text>Unknown Petition Type</Text>
        </View>
      );
  }
};

export default PetitionChart;
