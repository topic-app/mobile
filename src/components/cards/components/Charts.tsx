import React from 'react';
import { View } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';

import {
  PetitionVoteData,
  PetitionVoteDataNoGoal,
  PetitionVoteDataGoal,
  PetitionVoteDataDouble,
  PetitionVoteDataMultiple,
  Petition,
} from '@ts/types';
import { useTheme } from '@utils';

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
    let spacing = Math.round((vote / endGoal) * 100 - offset);
    if (spacing < 0) {
      spacing = 0;
    } else if (spacing > 90) {
      spacing = 90;
    }
    return `${spacing}$`;
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
        <Text style={{ position: 'absolute', right: 0, top: -24, color: colors.subtext }}>
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
      return <PetitionNoGoal voteData={voteData as PetitionVoteDataNoGoal} />;
    case 'goal':
      return <PetitionGoal voteData={voteData as PetitionVoteDataGoal} />;
    case 'opinion':
      return <PetitionDouble voteData={voteData as PetitionVoteDataDouble} />;
    case 'multiple':
      return <PetitionMultiple voteData={voteData as PetitionVoteDataMultiple} />;
    default:
      return (
        <View>
          <Text>Unknown Petition Type</Text>
        </View>
      );
  }
};

export default PetitionChart;
