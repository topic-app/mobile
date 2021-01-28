import React from 'react';
import { Linking, Platform, View } from 'react-native';
import { Text, Subheading, ProgressBar, Card, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';

import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { useTheme } from '@utils/index';

import Modal from './Modal';
import { PlatformTouchable } from './PlatformComponents';

const feedbackElements = {
  welcome: {
    id: '952675',
    name: "l'application (demo)",
  },
};

type Props = {
  type: keyof typeof feedbackElements;
};

const FeedbackCard: React.FC<Props> = ({ type }) => {
  const info = feedbackElements[type];

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const [feedbackModalVisible, setFeedbackModalVisible] = React.useState(false);
  const [rating, setRating] = React.useState<number | null>(null);
  const [completed, setCompleted] = React.useState(false);

  const uri = `https://feedback.topicapp.fr/index.php/${info.id}?lang=fr&newtest=Y${
    rating ? `&main=${rating}` : ''
  }`;

  return (
    <View style={[styles.container, { marginTop: 20 }]}>
      <Card
        elevation={0}
        style={{ backgroundColor: colors.primary }}
        theme={themes.light}
        onPress={() => {
          if (Platform.OS === 'web') {
            Linking.openURL(`https://feedback.topicapp.fr/index.php/${info.id}?lang=fr&newtest=Y`);
          } else {
            setFeedbackModalVisible(true);
          }
        }}
      >
        {completed ? (
          <View style={[styles.centerIllustrationContainer, styles.container]}>
            <Text style={{ color: colors.text, flex: 1, fontSize: 17 }}>
              Merci d&apos;avoir répondu !
            </Text>
          </View>
        ) : (
          <View style={[styles.centerIllustrationContainer, styles.container]}>
            <Text style={{ color: colors.text, flex: 1, fontSize: 17 }}>
              Donnez votre avis sur {info.name}
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: -5 }}>
              {[1, 2, 3, 4, 5].map((e) => (
                <IconButton
                  icon="star-outline"
                  style={{ alignSelf: 'center' }}
                  size={32}
                  color={colors.text}
                  onPress={() => {
                    setRating(e);
                    if (Platform.OS === 'web') {
                      Linking.openURL(
                        `https://feedback.topicapp.fr/index.php/${info.id}?lang=fr&newtest=Y&main=${e}`,
                      );
                    } else {
                      setFeedbackModalVisible(true);
                    }
                  }}
                />
              ))}
            </View>
          </View>
        )}
      </Card>
      {Platform.OS !== 'web' && (
        <Modal visible={feedbackModalVisible} setVisible={setFeedbackModalVisible}>
          <View style={{ height: 500, backgroundColor: colors.surface }}>
            <WebView
              source={{
                uri,
              }}
              onNavigationStateChange={(navState) => {
                if (navState.url === 'https://go.topicapp.fr') {
                  setFeedbackModalVisible(false);
                  setCompleted(true);
                }
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

export default FeedbackCard;
