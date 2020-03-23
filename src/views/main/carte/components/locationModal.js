// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SwipeUpComponent from './bottomSheet';

import places from '../data/testQueryResults.json';
import carteStyles from '../styles/Styles';
import { markerColors } from '../utils/getAssetColor';

const windowHeight = Dimensions.get('window').height;
const SNAP_POINTS_FROM_TOP = [0, windowHeight * 0.5, windowHeight * 0.73];

export default class LocationModalContents extends React.Component {
  genTagDecoration = (type) => {
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
    return {
      icon: 'map-marker',
      color: markerColors.red,
    };
  };

  render() {
    const { id } = this.props;
    let { name } = this.props;
    const place = places[id];
    const { icon, color } = this.genTagDecoration(place.type);

    if (name === '' || name === undefined) {
      name = place.name;
    }

    return (
      <View style={{ flex: 1 }}>
        <SwipeUpComponent
          allowDissmissSwipe
          snapPointsFromTop={SNAP_POINTS_FROM_TOP}
        >
          <View style={carteStyles.modalContainer}>
            <View style={carteStyles.pullUpTabContainer}>
              <View style={carteStyles.pullUpTab} />
            </View>

            <View style={carteStyles.modalTitleContainer}>
              <Icon name={icon} style={[{ color }, carteStyles.modalIcon]} />
              <Text
                style={[{ color }, carteStyles.modalTitle]}
                ellipsizeMode="tail"
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>

            <View style={carteStyles.horizontalLineContainer}>
              <View style={carteStyles.horizontalLine} />
            </View>

            <Text
              style={carteStyles.modalText}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {place.summary}
            </Text>
            <View style={carteStyles.horizontalLineContainer}>
              <View style={carteStyles.horizontalLine} />
            </View>
            <Text
              style={carteStyles.modalText}
            >
              {place.description}
            </Text>
          </View>
        </SwipeUpComponent>
      </View>
    );
  }
}

LocationModalContents.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};