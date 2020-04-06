// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { View, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Divider, Text } from 'react-native-paper';

import SwipeUpComponent from './bottomSheet';
import places from '../data/testQueryResults.json';
import explorerStyles from '../styles/Styles';
import { markerColors } from '../utils/getAssetColor';
import { styles } from '../../../../styles/Styles';

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

function checkLink(link, color) {
  if (link !== undefined && link !== '') {
    return (
      <Button
        icon="link-variant"
        mode="text"
        compact
        color={color}
        onPress={() => Linking.openURL(link)}
      >
        En savoir plus
      </Button>
    );
  }
  return null;
}

function LocationModalContents({ data, hideModal }) {
  const { icon, color } = genTagDecoration(data.type);
  const place = places[data.id];

  return (
    <View style={{ flex: 1 }}>
      <SwipeUpComponent hideModal={hideModal}>
        <View style={explorerStyles.modalContainer}>
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
          <Text style={explorerStyles.modalText} numberOfLines={3} ellipsizeMode="tail">
            {place.summary}
          </Text>
          <Divider style={styles.divider} />
          <Text
            style={explorerStyles.modalText}
            numberOfLines={place.link !== undefined && place.link !== '' ? 25 : 27}
            ellipsizeMode="tail"
          >
            {place.description}
          </Text>
          {checkLink(place.link, color)}
        </View>
      </SwipeUpComponent>
    </View>
  );
}

export default LocationModalContents;

LocationModalContents.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  hideModal: PropTypes.func.isRequired,
};
