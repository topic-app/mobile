import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import {
  Divider,
  Button,
  Text,
  TextInput,
  RadioButton,
  List,
  ProgressBar,
} from 'react-native-paper';
import { connect } from 'react-redux';

import getStyles from '@styles/Styles';
import { ModalProps, Account, State, RequestState } from '@ts/types';
import { Errors, trackEvent, useTheme } from '@utils';

import ErrorMessage from './ErrorMessage';
import Modal from './Modal';

type ReportModalProps = ModalProps & {
  report: (articleId: string, reason: string) => any;
  contentId: string;
  state: RequestState;
  account: Account;
  navigation: { navigate: Function };
};

const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  setVisible,
  report,
  state = { error: true },
  account,
  contentId,
  navigation = { navigate: () => {} },
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const reasons = [
    {
      id: 'ILLEGAL',
      name: 'Contenu illégal',
    },
    {
      id: 'ADULT',
      name: 'Contenu à caractère pornographique',
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
      id: 'IDENTITY',
      name: "Usurpation d'identité",
    },
    {
      id: 'COPYRIGHT',
      name: 'Atteinte à la propriété intellectuelle',
    },
    {
      id: 'OTHER',
      name: 'Autre',
    },
  ] as const;

  const [reportOption, setReportOption] = React.useState('OTHER');
  const [reportText, setReportText] = React.useState('');

  const reportContent = () => {
    trackEvent('report:report-content', { props: { reason: reportOption } });
    report(contentId, `${reportOption}${reportText ? `- ${reportText}` : ''}`)
      .then(() => {
        setReportText('');
        setVisible(false);
      })
      .catch((error: any) =>
        Errors.showPopup({
          type: 'axios',
          what: 'le signalement du contenu',
          error,
          retry: reportContent,
        }),
      );
  };

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <FlatList
        data={reasons}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.contentContainer}>
              <View style={styles.centerIllustrationContainer}>
                <Text>Reporter ce contenu</Text>
                <Text>Nous vous contacterons si nécessaire pour avoir plus de détails</Text>
              </View>
            </View>
            <Divider />
          </View>
        )}
        renderItem={({ item }) => {
          return (
            <View>
              <List.Item
                titleStyle={{
                  color: account.loggedIn ? colors.text : colors.disabled,
                }}
                title={item.name}
                onPress={() => setReportOption(item.id)}
                left={() =>
                  Platform.OS !== 'ios' && (
                    <RadioButton
                      value=""
                      disabled={!account.loggedIn}
                      color={colors.primary}
                      status={item.id === reportOption ? 'checked' : 'unchecked'}
                      onPress={() => setReportOption(item.id)}
                    />
                  )
                }
                right={() =>
                  Platform.OS === 'ios' && (
                    <RadioButton
                      value=""
                      disabled={!account.loggedIn}
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
                  disabled={!account.loggedIn}
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
                {account.loggedIn ? (
                  <Button
                    mode={Platform.OS === 'ios' ? 'outlined' : 'contained'}
                    color={colors.primary}
                    uppercase={Platform.OS !== 'ios'}
                    onPress={reportContent}
                    loading={state.loading}
                    style={{ flex: 1 }}
                  >
                    Signaler
                  </Button>
                ) : (
                  <View>
                    <Text>Connectez-vous pour signaler un contenu</Text>
                    <Text>
                      <Text
                        onPress={() =>
                          navigation.navigate('Auth', {
                            screen: 'Login',
                          })
                        }
                        style={[styles.link, styles.primaryText]}
                      >
                        Se connecter
                      </Text>
                      <Text> ou </Text>
                      <Text
                        onPress={() =>
                          navigation.navigate('Auth', {
                            screen: 'Create',
                          })
                        }
                        style={[styles.link, styles.primaryText]}
                      >
                        Créer un compte
                      </Text>
                    </Text>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return {
    account,
  };
};

export default connect(mapStateToProps)(ReportModal);
