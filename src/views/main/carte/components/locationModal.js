// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { styles, colors } from '../../../../styles/Styles';
import places from '../data/testQueryResults.json';
import carteStyles from '../styles/Styles';

export default class LocationModalContents extends React.Component {
  genTagIcon = (type) => {
    if (type === 'school') {
      return 'school';
    } if (type === 'museum') {
      return 'bank';
    }
    return 'map-marker';
  };

  truncate = (str, length, ending) => {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    }
    return str;
  };

  render() {
    const { id } = this.props;
    const place = places[id];



    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 4.5 }} />
        <View style={carteStyles.modalContainer}>
          <View style={carteStyles.modalTitleContainer}>
            <Icon name={this.genTagIcon(place.type)} style={carteStyles.modalIcon} />
            <View>
              <Text style={carteStyles.modalTitle}>
                {place.name}
              </Text>
              <Text style={carteStyles.modalAddress}>
                {place.address}
              </Text>
            </View>
          </View>
          <Text style={carteStyles.modalText}>
            {this.truncate(place.summary, 100, '...')}
          </Text>
        </View>
      </View>
    );
  }
}

LocationModalContents.propTypes = {
  id: PropTypes.string.isRequired,
};
