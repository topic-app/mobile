import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Text, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

import TagFlatlist from '../../../components/Tags';
import { styles } from '../../../../styles/Styles';

function PetitionGoalStatus({ petition: { objective, votes, title } }) {
  if (votes < objective) {
    return (
      <View style={{ marginTop: 10, marginHorizontal: 15 }}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    );
  }
  return (
    <View>
      <View style={{ marginTop: 10, marginHorizontal: 15, marginLeft: 40 }}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={{ marginTop: -29, marginLeft: 15 }}>
        <MaterialCommunityIcons name="check" color="green" size={20} />
      </View>
    </View>
  );
}

function PetitionSign({ petition }) {
  return (
    <View>
      <View style={{ marginLeft: 15 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.text}> Nombre de signatures: {petition.voteData.votes}</Text>
      </View>
    </View>
  );
}

function PetitionGoal({ petition }) {
  return (
    <View>
      <PetitionGoalStatus petition={petition} />
      <View style={{ marginTop: 10, marginHorizontal: 15, marginRight: 40 }}>
        <ProgressBar progress={petition.voteData.votes / petition.voteData.goal} color="#4c3e8e" />
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
      <View style={{ marginLeft: 15 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
      <View>
        <View style={{ flexDirection: 'row', marginVertical: 4 }}>
          <View style={{ marginLeft: 15 }}>
            <ProgressBar
              progress={petition.voteData.for / (petition.voteData.for + petition.voteData.against)}
              color="green"
            />
          </View>
          <View style={{ marginTop: -8 }}>
            <Text style={styles.text}> {petition.voteData.for} </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 4 }}>
          <View style={{ marginLeft: 15 }}>
            <ProgressBar
              progress={
                petition.voteData.against / (petition.voteData.for + petition.voteData.against)
              }
              color="red"
            />
          </View>
          <View style={{ marginTop: -7 }}>
            <Text style={styles.text}> {petition.voteData.against} </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function PetitionMultiple({ petition }) {
  let total = 0;
  petition.voteData.opinions.forEach((opinion) => {
    total += opinion.votes;
  });
  return (
    <View>
      <View style={{ marginLeft: 15 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
      <View>
        <View>
          {petition.voteData.opinions.map((opinion, key) => (
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text style={styles.text}>{opinion.title}</Text>
              </View>
              <View>
                <ProgressBar key={key} progress={opinion.votes / total} />
              </View>
            </View>
          ))}
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
    case 'multiple':
      return <PetitionMultiple petition={petition} />;
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
          <TagFlatlist type="petition" item={petition} />
          <View style={{ marginBottom: 10, marginLeft: 15 }}>
            <Text style={styles.text}> Fin {moment(petition.duration.end).fromNow()}</Text>
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
PetitionMultiple.propTypes = { petition: petitionPropType.isRequired };
