import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import TagFlatlist from '../../../components/Tags';

import { styles } from '../../../../styles/Styles';

function ActuComponentListCard({ article, navigate }) {
  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Touchable onPress={navigate}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: article.thumbnailUrl }}
              style={[
                styles.thumbnail,
                {
                  width: 120,
                  height: 120,
                },
              ]}
            />
            <View
              style={{
                margin: 10,
                marginTop: 0,
                marginLeft: 15,
                flex: 1,
              }}
            >
              <Text style={styles.cardTitle}>{article.title}</Text>
              <Paragraph style={styles.text}>{article.description}</Paragraph>
            </View>
          </View>
        </Touchable>
      </Card.Content>
      <Card.Content style={{ paddingTop: 5, paddingLeft: 0, paddingRight: 0 }}>
        <View style={{ marginTop: 10 }}>
        
        </View>
      </Card.Content>
    </Card>
  );
}

export default ActuComponentListCard;

ActuComponentListCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.shape({
      parser: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
