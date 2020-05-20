/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, TouchableOpacity, TouchableNativeFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Text, useTheme } from 'react-native-paper';
import moment from 'moment';

import TagList from '@components/TagList';
import getStyles from '@styles/Styles';
import PetitionChart from './Charts';

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
    return `${moment(time).diff(moment(), 'days')} j`;
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

            <PetitionChart voteData={petition.voteData} />
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
