import _ from 'lodash';
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
import { useTheme } from '@utils/index';

import getPetitionStyles from '../styles/Styles';
import MultiVote from './MultiVote';

type PetitionNoGoalProps = { signatures: number };

const PetitionNoGoal: React.FC<PetitionNoGoalProps> = ({ signatures }) => {
  const petitionStyles = getPetitionStyles(useTheme());
  return (
    <Text style={[petitionStyles.signText, { fontWeight: 'bold' }]}>{signatures} signatures</Text>
  );
};

type PetitionGoalProps = { signatures: number; goals: number[] };

const PetitionGoal: React.FC<PetitionGoalProps> = ({ signatures, goals }) => {
  const theme = useTheme();
  const { colors } = theme;
  const petitionStyles = getPetitionStyles(theme);

  // TODO: Intermediate goals
  const endGoal = goals[goals.length - 1];

  const getLeftSpacing = (vote: number) => {
    // TODO: Fix offset, not displaying properly on high density devices
    const offset = vote.toString().length * 2.5;
    // Return left spacing in percentage while making sure it stays in between 0% and 90%
    const spacing = Math.round((vote / endGoal) * 100 - offset);
    return `${_.clamp(spacing, 0, 90)}%`;
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

type PetitionMultipleProps = { multiple: PetitionVoteDataMultiple['multiple'] };

const PetitionMultiple: React.FC<PetitionMultipleProps> = ({ multiple }) => {
  const { colors } = useTheme();
  return <MultiVote items={multiple} barColors={Object.values(colors.solid)} />;
};

type PetitionDoubleProps = { double: PetitionVoteDataDouble['double'] };

const PetitionDouble: React.FC<PetitionDoubleProps> = ({ double }) => {
  const { colors } = useTheme();
  return (
    <View>
      <MultiVote
        items={[
          { title: 'Pour', votes: double.for },
          { title: 'Contre', votes: double.against },
        ]}
        barColors={[colors.valid, colors.error]}
        showAllLabels
      />
    </View>
  );
};

const PetitionUnknownData: React.FC = () => <Text>Données Introuvables</Text>;

type PetitionChartProps = {
  type: Petition['type'];
  voteData: PetitionVoteData;
};

const PetitionChart: React.FC<PetitionChartProps> = ({ type, voteData }) => {
  switch (type) {
    case 'sign':
      // NOTE: cannot be !voteData.signatures since signatures could be 0
      if (voteData.signatures === undefined) {
        return <PetitionUnknownData />;
      }
      return <PetitionNoGoal signatures={voteData.signatures} />;
    case 'goal':
      if (voteData.signatures === undefined || !voteData.goals) {
        return <PetitionUnknownData />;
      }
      return <PetitionGoal signatures={voteData.signatures} goals={voteData.goals} />;
    case 'opinion':
      if (!voteData.double) {
        return <PetitionUnknownData />;
      }
      return <PetitionDouble double={voteData.double} />;
    case 'multiple':
      if (!voteData.multiple) {
        return <PetitionUnknownData />;
      }
      return <PetitionMultiple multiple={voteData.multiple} />;
    default:
      return (
        <View>
          <Text>Type de pétition inconnu</Text>
        </View>
      );
  }
};

export default PetitionChart;
