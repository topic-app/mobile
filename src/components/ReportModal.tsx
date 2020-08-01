import React from 'react';
import { ModalProps, State, ArticleListItem } from '@ts/types';
import {
  Divider,
  Button,
  Text,
  TextInput,
  Card,
  useTheme,
  RadioButton,
  List,
  ProgressBar,
} from 'react-native-paper';
import { View, Platform, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

import { CollapsibleView, ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';

type ReportModalProps = ModalProps & {
  report: (articleId: string, reason: string) => any;
  contentId: string;
};

function ReportModal({
  visible,
  setVisible,
  report,
  state = { error: true },
  contentId,
}: ReportModalProps) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const reasons = [
    {
      id: 'ILLEGAL',
      name: 'Contenu illégal',
    },
    {
      id: 'EXPLICIT',
      name: 'Contenu explicite ou non conforme',
    },
    {
      id: 'MISINFORMATION',
      name: 'Contenu trompeur ou diffamation',
    },
    {
      id: 'HATE',
      name: 'Contenu haineux ou discriminatoire',
    },
    {
      id: 'PRIVATEDATA',
      name: 'Atteinte à la vie privée',
    },
    {
      id: 'COPYRIGHT',
      name: 'Atteinte à la propriété intellectuelle',
    },
    {
      id: 'OTHER',
      name: 'Autre',
    },
  ];

  const [reportOption, setReportOption] = React.useState('OTHER');
  const [reportText, setReportText] = React.useState('');

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => setVisible(false)}
      onBackButtonPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection={['down']}
      style={styles.bottomModal}
    >
      <Card>
        <FlatList
          data={reasons}
          ListHeaderComponent={() => (
            <View>
              <View style={styles.contentContainer}>
                <View style={styles.centerIllustrationContainer}>
                  <Text>Reporter ce contenu</Text>
                  <Text>Nous vous contacterons si nécéssaire pour avoir plus de détails</Text>
                </View>
              </View>
              {state.error && (
                <ErrorMessage
                  type="axios"
                  strings={{
                    what: 'le signalement du contenu',
                    contentSingular: 'Le contenu',
                  }}
                  error={state.error}
                  retry={() =>
                    report(contentId, `${reportOption}${reportText ? `- ${reportText}` : ''}`).then(
                      () => {
                        setReportText(''), setVisible(false);
                      },
                    )
                  }
                />
              )}
              {state.loading && <ProgressBar />}
              <Divider />
            </View>
          )}
          renderItem={({ item }) => {
            return (
              <View>
                <List.Item
                  title={item.name}
                  onPress={() => setReportOption(item.id)}
                  left={() =>
                    Platform.OS !== 'ios' && (
                      <RadioButton
                        color={colors.primary}
                        status={item.id === reportOption ? 'checked' : 'unchecked'}
                        onPress={() => setReportOption(item.id)}
                      />
                    )
                  }
                  right={() =>
                    Platform.OS === 'ios' && (
                      <RadioButton
                        color={colors.primary}
                        status={item.id === reportOption ? 'checked' : 'unchecked'}
                        onPress={() => setReportOption(item.id)}
                      />
                    )
                  }
                />
              </View>
            );
          }}
          ListFooterComponent={() => {
            return (
              <View>
                <Divider />
                <View style={styles.container}>
                  <TextInput
                    mode="outlined"
                    multiline
                    label="Autres informations (facultatif)"
                    value={reportText}
                    onChangeText={(text) => {
                      setReportText(text);
                    }}
                  />
                </View>
                <Divider />
                <View style={styles.contentContainer}>
                  <Button
                    mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                    color={colors.primary}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={() =>
                      report(
                        contentId,
                        `${reportOption}${reportText ? `- ${reportText}` : ''}`,
                      ).then(() => {
                        setReportText(''), setVisible(false);
                      })
                    }
                    style={{ flex: 1 }}
                  >
                    Reporter
                  </Button>
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </Card>
    </Modal>
  );
}

export default ReportModal;
