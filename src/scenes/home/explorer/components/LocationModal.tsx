import moment from 'moment';
import React from 'react';
import { View, Image, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Button, Divider, Text, Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import places from '@src/data/explorerListData.json';
import getStyles from '@styles/Styles';
import { ExplorerLocation } from '@ts/types';
import { useTheme, logger } from '@utils/index';

import getExplorerStyles from '../styles/Styles';
import { markerColors } from '../utils/getAsset';
import type { MapMarkerDataType } from '../views/Map';

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

function renderExtraLocationData(place: ExplorerLocation.Location) {
  if (place.type === 'school' && place.data.cache?.events) {
    return (
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', paddingLeft: 12 }}>
          Il y a {place.data.cache.events}
        </Text>
      </View>
    );
  }
  return null;
}

type LocationModalProps = {
  mapMarkerData: MapMarkerDataType;
};

const LocationModal: React.FC<LocationModalProps> = ({ mapMarkerData }) => {
  const theme = useTheme();
  const place = places.find((t) => t.data._id === mapMarkerData.id) as ExplorerLocation.Location;

  if (!place) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Chargement du lieu</Text>
      </View>
    );
  }

  const styles = getStyles(theme);
  const explorerStyles = getExplorerStyles(theme);

  let title = '';
  let description = '';
  let stats = '';

  switch (place.type) {
    case 'event':
      title = place.data.title;
      description = place.data.summary;
      stats = 'Dans X Heures';
      break;
    case 'place':
      title = place.data.displayName;
      description = place.data.summary;
      break;
    case 'school':
      title = place.data.displayName;
      break;
    case 'secret':
      title = place.data.displayName;
      description = place.data.summary;
  }

  const { icon, color } = genTagDecoration(place.type);

  return (
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
            {title}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={{ height: 40, width: '100%', flexDirection: 'row' }}>
          <View style={{ justifyContent: 'center' }}>
            <Title>{stats}</Title>
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'flex-end', flex: 1 }}>
            <Button mode="contained" style={{ flex: 1 }}>
              Plus d&apos;Infos
            </Button>
          </View>
        </View>

        <Divider style={styles.divider} />

        <Text style={explorerStyles.modalText} numberOfLines={4} ellipsizeMode="tail">
          {description}
        </Text>

        <Divider style={styles.divider} />
      </View>
      {renderExtraLocationData(place)}
    </View>
  );
};

export default LocationModal;
