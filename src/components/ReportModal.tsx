import React from 'react';
import { ModalProps, Account, State } from '@ts/types';
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
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import { ErrorMessage } from '@components/index';
import getStyles from '@styles/Styles';

type ReportModalProps = ModalProps & {
  report: (articleId: string, reason: string) => any;
  contentId: string;
  state: { loading: boolean; success: boolean; error: any };
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
                  titleStyle={{
                    color: account.loggedIn ? colors.text : colors.disabled,
                  }}
                  title={item.name}
                  onPress={() => setReportOption(item.id)}
                  left={() =>
                    Platform.OS !== 'ios' && (
                      <RadioButton
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
                      Signaler
                    </Button>
                  ) : (
                    <View>
                      <Text>Connectez vous pour signaler un contenu</Text>
                      <Text>
                        <Text
                          onPress={() =>
                            navigation.navigate('Auth', {
                              scrReportereen: 'Login',
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
                          créér un compte
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
      </Card>
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
