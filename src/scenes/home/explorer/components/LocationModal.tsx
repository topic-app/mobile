import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Divider, Text, withTheme, Card, Title } from 'react-native-paper';
import moment from 'moment';

import { useTheme, logger } from '@utils/index';
import getStyles from '@styles/Styles';
import places from '@src/data/explorerListData.json';

import BottomSheet from './BottomSheet';
import getExplorerStyles from '../styles/Styles';
import { markerColors } from '../utils/getAsset';

function genTagDecoration(type) {
  if (type === 'school') {
    return {
      icon: 'school',
      color: markerColors.purple,
    };
  }
  if (type === 'museum') {
    return {
      icon: 'bank',
      color: markerColors.red,
    };
  }
  if (type === 'event') {
    return {
      icon: 'calendar',
      color: markerColors.green,
    };
  }
  if (type === 'secret') {
    return {
      icon: 'egg-easter',
      color: markerColors.secret,
    };
  }
  return {
    icon: 'map-marker',
    color: markerColors.red,
  };
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function LocationEvent({ title, summary, imageUrl, date }) {
  const styles = getStyles(useTheme());
  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
  return (
    <Card style={styles.card}>
      <Touchable onPress={() => logger.warn('Navigate to event')}>
        <View style={{ padding: 10 }}>
          <Title
            style={[styles.cardTitle, { marginBottom: 0 }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Title>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: imageUrl }}
              style={{ width: 100, height: 100, alignSelf: 'center' }}
              resizeMode="contain"
            />
            <View style={{ margin: 10, width: '70%' }}>
              <Text style={{ color: 'gray', fontSize: 16 }}>
                {capitalize(moment(date).fromNow())}
              </Text>
              <Text style={{ fontSize: 16 }} ellipsizeMode="tail" numberOfLines={3}>
                {summary}
              </Text>
            </View>
          </View>
        </View>
      </Touchable>
    </Card>
  );
}

function renderLocationStats(place) {
  switch (place.type) {
    case 'event':
      return 'Dans X Heures';
    case 'school':
      return 'Collège et Lycée'; // TODO: Get info from server
    case 'museum':
      return 'Musée';
    default:
      return '';
  }
}

function renderExtraLocationData(cache) {
  if (cache && cache.events) {
    return (
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', paddingLeft: 12 }}>
          Prochains Évènements
        </Text>
        {cache.events.map((event) => (
          <LocationEvent
            key={event._id}
            title={event.title}
            summary={event.summary}
            date={event.date}
            imageUrl={event.imageUrl}
          />
        ))}
      </View>
    );
  }
  return null;
}

function LocationModal({ data, hideModal }) {
  const { icon, color } = genTagDecoration(data.type);
  const place = places.find((t) => t._id === data.id);

  const theme = useTheme();
  const styles = getStyles(theme);
  const explorerStyles = getExplorerStyles(theme);

  return (
    <View style={{ flex: 1 }}>
      <BottomSheet hideModal={hideModal}>
        <View style={explorerStyles.modalContainer}>
          <View style={explorerStyles.contentContainer}>
            <View style={explorerStyles.pullUpTabContainer}>
              <View style={explorerStyles.pullUpTab} />
            </View>

            <View style={explorerStyles.modalTitleContainer}>
              <Icon name={icon} style={[{ color }, explorerStyles.modalIcon]} />
              <Text
                style={[{ color }, explorerStyles.modalTitle]}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {data.name}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={{ height: 40, width: '100%', flexDirection: 'row' }}>
              <View style={{ justifyContent: 'center' }}>
                <Title>{renderLocationStats(place)}</Title>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
                <Button mode="contained" style={{ flex: 1 }}>
                  Plus d&apos;Infos
                </Button>
              </View>
            </View>

            <Divider style={styles.divider} />

            <Text style={explorerStyles.modalText} numberOfLines={4} ellipsizeMode="tail">
              {place.summary}
            </Text>

            <Divider style={styles.divider} />
          </View>
          {renderExtraLocationData(place.cache)}
        </View>
      </BottomSheet>
    </View>
  );
}

export default withTheme(LocationModal);

LocationModal.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  hideModal: PropTypes.func.isRequired,
  theme: PropTypes.shape({}).isRequired,
};

LocationEvent.propTypes = {
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
