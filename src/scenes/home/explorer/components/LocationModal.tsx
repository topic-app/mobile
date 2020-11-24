import { useDimensions } from '@react-native-community/hooks';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
} from 'react-native';
import { Button, Divider, Text, Card, Title, Subheading } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { TabChipList } from '@root/src/components';
import places from '@src/data/explorerListData.json';
import getStyles from '@styles/Styles';
import { ExplorerLocation } from '@ts/types';
import { useTheme, logger } from '@utils/index';

import getExplorerStyles from '../styles/Styles';
import { markerColors } from '../utils/getAsset';
import { getStrings } from '../utils/getStrings';
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
                {_.capitalize(moment(date).fromNow())}
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

  const minHeight = useDimensions().window.height - 54;
  if (!place) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Chargement du lieu</Text>
      </View>
    );
  }

  const styles = getStyles(theme);
  const explorerStyles = getExplorerStyles(theme);

  const { icon, title, subtitle, description, detail } = getStrings(place);

  return (
    <View style={[explorerStyles.modalContainer, { minHeight }]}>
      <View style={explorerStyles.contentContainer}>
        <View style={explorerStyles.pullUpTabContainer}>
          <View style={explorerStyles.pullUpTab} />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={explorerStyles.modalTitle} numberOfLines={2}>
              {title}
            </Text>
            <Subheading style={explorerStyles.modalSubtitle}>
              {subtitle ? (
                <Subheading style={explorerStyles.modalSubtitle}>{subtitle} · </Subheading>
              ) : null}
              {detail}
            </Subheading>
          </View>
          <View style={{ justifyContent: 'center' }}>
            <Icon name={icon} style={[explorerStyles.modalIcon]} />
          </View>
        </View>
        {/* <TabChipList
          sections={{
          }}
          selected={chipTab}
          setSelected={changeList}
          configure={() =>
            navigation.navigate('Main', {
              screen: 'Configure',
              params: {
                screen: 'Article',
              },
            })
          }
        /> */}

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
