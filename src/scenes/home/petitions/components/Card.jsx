/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Text, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, ProgressBar, withTheme } from 'react-native-paper';
import moment from 'moment';

import TagList from '../../../../components/TagList';
import getStyles from '../../../../styles/Styles';

function PetitionGoalStatus({ petition, theme }) {
  const styles = getStyles(theme);
  if (petition.voteData.votes < petition.voteData.goal) {
    return (
      <View style={{ marginHorizontal: 15, marginVertical: 4 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
    );
  }
  return (
    <View>
      <View style={{ marginHorizontal: 15, marginVertical: 4, marginLeft: 40 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
      <View style={{ marginTop: -29, marginLeft: 15 }}>
        <MaterialCommunityIcons name="check" color="green" size={20} />
      </View>
    </View>
  );
}

function PetitionSign({ petition, theme }) {
  const styles = getStyles(theme);
  return (
    <View>
      <View style={{ marginHorizontal: 15, marginVertical: 4 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
      <View style={{ marginLeft: 15 }}>
        <Text style={styles.text}>Signatures: {petition.voteData.votes}</Text>
      </View>
    </View>
  );
}

function PetitionGoal({ petition, theme }) {
  const styles = getStyles(theme);
  return (
    <View>
      <PetitionGoalStatus theme={theme} petition={petition} />
      <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
        <View>
          <ProgressBar
            progress={petition.voteData.votes / petition.voteData.goal}
            color="#4c3e8e"
          />
        </View>
        <View style={{ flexDirection: 'row', marginHorizontal: 15 }}>
          <View>
            <Text style={styles.text}>Signatures: {petition.voteData.votes} /</Text>
          </View>
          <View>
            <Text style={styles.text}> Objectif: {petition.voteData.goal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function PetitionOpinion({ petition, theme }) {
  const styles = getStyles(theme);
  return (
    <View>
      <View style={{ marginHorizontal: 15, marginVertical: 4 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
      <View>
        <View style={{ marginVertical: 4, marginHorizontal: 15 }}>
          <View>
            <ProgressBar
              progress={petition.voteData.for / (petition.voteData.for + petition.voteData.against)}
              color="green"
            />
          </View>
          <View>
            <Text style={styles.text}> Pour: {petition.voteData.for}</Text>
          </View>
        </View>
        <View style={{ marginVertical: 4, marginHorizontal: 15 }}>
          <View>
            <ProgressBar
              progress={
                petition.voteData.against / (petition.voteData.for + petition.voteData.against)
              }
              color="red"
            />
          </View>
          <View>
            <Text style={styles.text}> Contre: {petition.voteData.against}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function PetitionMultiple({ petition, theme }) {
  const styles = getStyles(theme);
  let total = 0;
  petition.voteData.opinions.forEach((opinion) => {
    total += opinion.votes;
  });
  return (
    <View>
      <View style={{ marginHorizontal: 15, marginVertical: 4 }}>
        <Text style={styles.cardTitle}>{petition.title}</Text>
      </View>
      <View>
        <View>
          {petition.voteData.opinions.map((opinion, key) => (
            <View key={key} style={{ marginVertical: 3, marginHorizontal: 15 }}>
              <View>
                <ProgressBar progress={opinion.votes / total} />
              </View>
              <View>
                <Text style={styles.text}>
                  {opinion.title}: {opinion.votes}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function renderPetition(petition, theme) {
  switch (petition.voteData.type) {
    case 'sign':
      return <PetitionSign theme={theme} petition={petition} />;
    case 'goal':
      return <PetitionGoal theme={theme} petition={petition} />;
    case 'opinion':
      return <PetitionOpinion theme={theme} petition={petition} />;
    case 'multiple':
      return <PetitionMultiple theme={theme} petition={petition} />;
    default:
      return (
        <View>
          <Text>Unknown Petition Type</Text>
        </View>
      );
  }
}

function PetitionComponentListCard({ navigate, petition, theme }) {
  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
  const styles = getStyles(theme);

  return (
    <Card style={styles.card}>
      <Touchable onPress={navigate}>
        <Card.Content style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
          <View>{renderPetition(petition, theme)}</View>
          <TagList type="petition" item={petition} />
          <View style={{ marginBottom: 10, marginLeft: 15 }}>
            <Text style={styles.text}> Fin {moment(petition.duration.end).fromNow()}</Text>
          </View>
        </Card.Content>
      </Touchable>
    </Card>
  );
}

export default withTheme(PetitionComponentListCard);

const petitionPropType = PropTypes.shape({
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
  duration: PropTypes.shape({
    start: PropTypes.string.isRequired, // Note: need to change to instanceOf(Date) once we get axios working
    end: PropTypes.string.isRequired,
  }).isRequired,
  description: PropTypes.string,
  objective: PropTypes.string,
  votes: PropTypes.string,
});

PetitionComponentListCard.propTypes = {
  petition: petitionPropType.isRequired,
  navigate: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

PetitionOpinion.propTypes = {
  petition: petitionPropType.isRequired,
  theme: PropTypes.shape({}).isRequired,
};
PetitionGoal.propTypes = {
  petition: petitionPropType.isRequired,
  theme: PropTypes.shape({}).isRequired,
};
PetitionSign.propTypes = {
  petition: petitionPropType.isRequired,
  theme: PropTypes.shape({}).isRequired,
};
PetitionGoalStatus.propTypes = {
  petition: petitionPropType.isRequired,
  theme: PropTypes.shape({}).isRequired,
};
PetitionMultiple.propTypes = {
  petition: petitionPropType.isRequired,
  theme: PropTypes.shape({}).isRequired,
};