import React from 'react';
import { Linking, Platform, View } from 'react-native';
import { Text, Subheading, ProgressBar, Card, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';

import { updatePrefs } from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import themes from '@styles/Theme';
import { PreferencesState, State } from '@ts/types';
import { useTheme } from '@utils/index';

import Modal from './Modal';

const feedbackElements = {
  welcome: {
    id: '952675',
    name: "l'application (demo)",
  },
  thirdopen: {
    id: '798293',
    name: "l'application",
  },
  accountcreate: {
    id: '525442',
    name: 'la création de compte',
  },
  articleadd: {
    id: '368491',
    name: "l'écriture d'article",
  },
  recommendations: {
    id: '935254',
    name: 'les recommendations',
  },
};

type Props = {
  type: keyof typeof feedbackElements;
  preferences: PreferencesState;
  closable?: boolean;
};

const FeedbackCard: React.FC<Props> = ({ type, preferences, closable = false }) => {
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

  if (preferences.completedFeedback?.includes(type) && !completed) {
    return null;
  }

  return (
    <View style={[styles.container, { marginTop: 20 }]}>
      <Card
        elevation={0}
        style={{ backgroundColor: colors.primary }}
        theme={themes.light}
        onPress={
          completed
            ? undefined
            : () => {
                if (Platform.OS === 'web') {
                  Linking.openURL(
                    `https://feedback.topicapp.fr/index.php/${info.id}?lang=fr&newtest=Y`,
                  );
                  setCompleted(true);
                  updatePrefs({
                    completedFeedback: [...preferences.completedFeedback, type],
                  });
                } else {
                  setFeedbackModalVisible(true);
                }
              }
        }
      >
        {completed ? (
          <View
            style={[
              styles.container,
              { flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' },
            ]}
          >
            <Text style={{ color: colors.text, fontSize: 17 }}>Merci d&apos;avoir répondu !</Text>
            {closable && (
              <View
                style={{
                  position: 'absolute',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  width: '100%',
                }}
              >
                <IconButton
                  icon="close"
                  size={28}
                  color={colors.disabled}
                  onPress={() => {
                    setCompleted(false);
                  }}
                />
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.centerIllustrationContainer, styles.container]}>
            {closable && (
              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'flex-end',
                }}
              >
                <IconButton
                  icon="close"
                  size={28}
                  color={colors.disabled}
                  onPress={() => {
                    updatePrefs({
                      completedFeedback: [...preferences.completedFeedback, type],
                    });
                  }}
                />
              </View>
            )}
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
                      setCompleted(true);
                      updatePrefs({
                        completedFeedback: [...preferences.completedFeedback, type],
                      });
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
                if (
                  navState.url.includes('go.topicapp.fr') ||
                  navState.url.includes('www.topicapp.fr')
                ) {
                  setFeedbackModalVisible(false);
                  setCompleted(true);
                  updatePrefs({
                    completedFeedback: [...preferences.completedFeedback, type],
                  });
                }
              }}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return {
    preferences,
  };
};

export default connect(mapStateToProps)(FeedbackCard);
