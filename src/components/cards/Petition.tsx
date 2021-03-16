import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';
import React from 'react';
import { View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import getStyles from '@styles/global';
import { PetitionStatus, PetitionPreload, Theme } from '@ts/types';

import { CardBase } from '../Cards';
import TagList from '../TagList';
import PetitionChart from './components/Charts';

function getShortTime(time: string) {
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

type StatusChipProps = {
  mode?: 'contained' | 'text' | 'outlined';
  icon?: string;
  color: string;
  label: string;
};

const StatusChip: React.FC<StatusChipProps> = ({ mode = 'contained', color, icon, label }) => {
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
      {icon ? <Icon name={icon} color={textColor} size={17} style={{ paddingRight: 2 }} /> : null}
      <Text style={{ color: textColor, fontSize: 13 }}>{label}</Text>
    </View>
  );
};

function renderPetitionStatus(status: PetitionStatus, theme: Theme) {
  const { colors } = theme;

  switch (status) {
    case 'answered':
      return <StatusChip color={colors.valid} icon="check" label="Réussite" />;
    case 'closed':
      return <StatusChip mode="text" color={colors.disabled} icon="lock" label="Fermée" />;
    default:
      return (
        <StatusChip mode="text" color={colors.disabled} icon="clock-outline" label="En Attente" />
      );
  }
}

type PetitionCardProps = {
  navigate: StackNavigationProp<any, any>['navigate'];
  petition: PetitionPreload;
};

const PetitionCard: React.FC<PetitionCardProps> = ({ navigate, petition }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const endTime = getShortTime(petition.duration.end);

  return (
    <CardBase onPress={navigate}>
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
        +
        <PetitionChart type={petition.type} voteData={petition.cache} />
      </Card.Content>

      <Card.Content style={{ marginTop: 5, paddingHorizontal: 0 }}>
        <TagList item={petition} scrollable={false} />
      </Card.Content>
    </CardBase>
  );
};

export default PetitionCard;
