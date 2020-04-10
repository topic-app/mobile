import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Text, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TagFlatlist from '../../../components/Tags';
import { styles } from '../../../../styles/Styles';

function PetitionGoalStatus({ petition: { objective, votes, title } }) {
  if (votes < objective) {
    return (
      <View style={{ marginTop: 10, marginHorizontal: 15 }}>
        <Text style={styles.petitionCardTitle}>{title}</Text>
      </View>
    );
  }
  return (
    <View>
      <View style={{ marginTop: 10, marginHorizontal: 15, marginLeft: 30 }}>
        <Text style={styles.petitionCardTitle}>{title}</Text>
      </View>
      <View style={{ marginTop: -23, marginLeft: 15 }}>
        <MaterialCommunityIcons name="check" color="green" size={20} />
      </View>
    </View>
  );
}

function PetitionSign({ petition }) {
  return (
    <View>
      <View>
        <Text style={styles.text}>{petition.title}</Text>
      </View>
      <View>
        <Text style={styles.text}>{petition.voteData.votes}</Text>
      </View>
    </View>
  );
}

function PetitionGoal({ petition }) {
  return (
    <View>
      <PetitionGoalStatus petition={petition} />
      <View style={{ marginTop: 10, marginHorizontal: 15, marginRight: 40 }}>
        <ProgressBar progress={petition.votes / petition.objective} color="#4c3e8e" />
      </View>
      <View style={{ marginTop: -14, marginLeft: 340 }}>
        <Text style={styles.text}> {petition.votes} </Text>
      </View>
    </View>
  );
}

function PetitionOpinion({ petition }) {
  return (
    <View>
      <View style={{ marginTop: 10, marginHorizontal: 15 }}>
        <Text style={styles.petitionCardTitle}> {petition.title} </Text>
      </View>
      <View>
        <View>
          <View style={{ marginTop: 10, marginHorizontal: 15, marginRight: 40 }}>
            <ProgressBar
              progress={petition.voteData.for / (petition.voteData.for + petition.voteData.against)}
              color="green"
            />
          </View>
          <View style={{ marginTop: -14, marginLeft: 340 }}>
            <Text style={styles.text}> {petition.votes} </Text>
          </View>
        </View>
        <View>
          <View style={{ marginTop: 10, marginHorizontal: 15, marginRight: 40 }}>
            <ProgressBar
              progress={petition.voteData.for / (petition.voteData.for + petition.voteData.against)}
              color="red"
            />
          </View>
          <View style={{ marginTop: -14, marginLeft: 340 }}>
            <Text style={styles.text}> {petition.votes} </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function renderPetition(petition) {
  switch (petition.voteData.type) {
    case 'sign':
      return <PetitionSign petition={petition} />;
    case 'goal':
      return <PetitionGoal petition={petition} />;
    case 'opinion':
      return <PetitionOpinion petition={petition} />;
    default:
      return (
        <View>
          <Text>Unknown Petition Type</Text>
        </View>
      );
  }
}

function PetitionComponentListCard({ navigate, petition }) {
  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <Card style={styles.card}>
      <Touchable onPress={navigate}>
        <Card.Content style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
          <View>{renderPetition(petition)}</View>
          <TagFlatlist item={petition} />
          <View style={{ marginBottom: 10, marginLeft: 15 }}>
            <Text style={styles.text}> Fin dans {petition.duration} </Text>
          </View>
        </Card.Content>
      </Touchable>
    </Card>
  );
}

export default PetitionComponentListCard;

const petitionPropType = PropTypes.shape({
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
  date: PropTypes.string.isRequired,
  duration: PropTypes.string.isRequired,
  description: PropTypes.string,
  objective: PropTypes.string,
  votes: PropTypes.string,
});

PetitionComponentListCard.propTypes = {
  petition: petitionPropType.isRequired,
  navigate: PropTypes.func.isRequired,
};

PetitionOpinion.propTypes = { petition: petitionPropType.isRequired };
PetitionGoal.propTypes = { petition: petitionPropType.isRequired };
PetitionSign.propTypes = { petition: petitionPropType.isRequired };
PetitionGoalStatus.propTypes = { petition: petitionPropType.isRequired };
