import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import shortid from 'shortid';

import getPetitionStyles from '../styles/PetitionStyles';

const MAX_LABELS = 3;

function MultiVote({ items, barColors, showAllLabels }) {
  const theme = useTheme();
  const petitionStyles = getPetitionStyles(theme);
  const { colors } = theme;

  const sortedItems = items.sort((a, b) => b.votes - a.votes);
  const votes = sortedItems.map((data) => data.votes);
  const labels = sortedItems.map((data) => data.title);

  const total = votes.reduce((sum, current) => sum + current);

  const getWidth = (vote) => `${((vote / total) * 100).toFixed(2)}%`;

  let numLabels = 0;

  return (
    <View style={petitionStyles.progressContainer}>
      <View style={[petitionStyles.progressRadius, { flexDirection: 'row', overflow: 'hidden' }]}>
        {votes.map((vote, index) => (
          // Render colored progress bar
          <View
            key={shortid()}
            style={[
              petitionStyles.progress,
              {
                width: getWidth(vote),
                backgroundColor: barColors[index],
                alignItems: 'center',
              },
            ]}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        {votes.slice(0, MAX_LABELS).map((vote, index) => {
          // Render first three vote labels while making sure label isn't bigger than area
          if (vote / total > 0.1 && !(vote.toString().length > 3 && vote / total < 0.2)) {
            numLabels += 1;
            return (
              <View key={shortid()} style={{ width: getWidth(vote), alignItems: 'center' }}>
                <Text
                  style={[
                    petitionStyles.voteLabelMultiple,
                    { backgroundColor: barColors[index] ?? colors.primary },
                  ]}
                >
                  {vote}
                </Text>
              </View>
            );
          }
          return null;
        })}
      </View>
      <View style={{ flexDirection: 'row', paddingTop: 10 }}>
        {labels.slice(0, showAllLabels ? MAX_LABELS : numLabels).map((label, index) => {
          return (
            <View
              key={shortid()}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 4,
                  backgroundColor: barColors[index],
                  marginRight: 5,
                }}
              />
              <Text numberOfLines={1}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export default MultiVote;

MultiVote.defaultProps = {
  showAllLabels: false,
};

MultiVote.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
    }),
  ).isRequired,
  barColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  showAllLabels: PropTypes.bool,
};
