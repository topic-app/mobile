import React from 'react';
import { connect } from 'react-redux';
import { Platform, View, Alert, ScrollView, Clipboard, Share } from 'react-native';
import { Text, Button, Divider, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackScreenProps } from '@react-navigation/stack';

import { State, ArticleRequestState, Account } from '@ts/types';
import { Illustration, ArticleCard, ErrorMessage, SafeAreaView } from '@components/index';
import { useTheme } from '@utils/index';
import { articleVerificationApprove } from '@redux/actions/apiActions/articles';
import getStyles from '@styles/Styles';

import type { GroupAddStackParams } from '../index';
import getAuthStyles from '../styles/Styles';

type Props = StackScreenProps<GroupAddStackParams, 'Success'> & {
  reqState: ArticleRequestState;
  account: Account;
  route: {
    params: {
      id: string;
      creationData: {
        title: string;
        summary: string;
        image: {
          image: string;
        };
        group: string;
        data: string;
      };
    };
  };
};

const ArticleAddSuccess: React.FC<Props> = ({ navigation, reqState, account, route }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);
  const { colors } = theme;

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
          <Illustration name="auth-register-success" height={200} width={200} />
          <Text style={authStyles.title}>Groupe en attente de vérification</Text>
          <View>
            <Text style={{ marginTop: 40 }}>
              Votre article doit être approuvé par un administrateur.
            </Text>
            <Text>Vous serez notifiés par email dès que l'article est approuvé.</Text>
          </View>
        </View>
      </ScrollView>
      <Divider />
      <View style={authStyles.formContainer}>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() =>
              navigation.navigate('Main', {
                screen: 'Home1',
                params: { screen: 'Home2', params: { screen: 'Article' } },
              })
            }
            style={{ flex: 1 }}
          >
            Continuer
          </Button>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, articles } = state;
  return { account, reqState: articles.state };
};

export default connect(mapStateToProps)(ArticleAddSuccess);
