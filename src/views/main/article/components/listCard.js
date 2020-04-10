import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Image } from 'react-native';
import { Card, Paragraph, Text } from 'react-native-paper';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import TagFlatlist from '../../../components/Tags';

import { styles } from '../../../../styles/Styles';

function ActuComponentListCard({ article, navigate }) {
  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <Card style={styles.card}>
      <Touchable onPress={navigate}>
        <View style={{ paddingTop: 10, paddingBottom: 5 }}>
          <Card.Content>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {article.thumbnailUrl ? (
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
              ) : (
                <View
                  style={{
                    width: 120,
                    height: 120,
                  }}
                />
              )}
              <View
                style={{
                  margin: 10,
                  marginTop: 0,
                  marginLeft: 15,
                  flex: 1,
                }}
              >
                <Text style={styles.cardTitle}>{article.title}</Text>
                <Paragraph style={styles.text}>{article.summary}</Paragraph>
              </View>
            </View>
          </Card.Content>
          <Card.Content style={{ marginTop: 5, paddingHorizontal: 0 }}>
            <TagFlatlist item={article} />
          </Card.Content>
        </View>
      </Touchable>
    </Card>
  );
}

export default ActuComponentListCard;

ActuComponentListCard.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
    summary: PropTypes.string,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
