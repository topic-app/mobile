import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View, Image, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { Card, Paragraph, Text } from 'react-native-paper';
import moment from 'moment';

import TagList from '../../../../components/TagList';
import { styles } from '../../../../styles/Styles';

function ActuComponentListCard({ article, navigate }) {
  const Touchable = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;

  return (
    <Card style={styles.card}>
      <Touchable onPress={navigate}>
        <View style={{ paddingTop: 10, paddingBottom: 5 }}>
          <Card.Content>
            <Text style={styles.cardTitle}>{article.title}</Text>
          </Card.Content>
          <Card.Content style={{ marginTop: 5 }}>
            <View style={{ flexDirection: 'row' }}>
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
                <Text style={styles.subtitle}>Publié {moment(article.date).fromNow()}</Text>
                <Paragraph style={styles.text}>{article.summary}</Paragraph>
              </View>
            </View>
          </Card.Content>
          <Card.Content style={{ marginTop: 5, paddingHorizontal: 0 }}>
            <TagList type="article" item={article} />
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
    thumbnailUrl: PropTypes.string,
    summary: PropTypes.string,
    date: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};
