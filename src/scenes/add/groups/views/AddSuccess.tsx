import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Platform, View, ScrollView } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration } from '@components/index';
import getStyles from '@styles/Styles';
import { State, ArticleRequestState, Account } from '@ts/types';
import { useTheme } from '@utils/index';

import type { GroupAddStackParams } from '../index';
import getAuthStyles from '../styles/Styles';

type GroupAddSuccessProps = StackScreenProps<GroupAddStackParams, 'Success'> & {
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

const GroupAddSuccess: React.FC<GroupAddSuccessProps> = ({
  navigation,
  reqState,
  account,
  route,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const authStyles = getAuthStyles(theme);

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
          <Illustration name="auth-register-success" height={200} width={200} />
          <Text style={authStyles.title}>Groupe en attente de vérification</Text>
          <View>
            <Text style={{ marginTop: 40 }}>
              Votre groupe doit être approuvé par un administrateur.
            </Text>
            <Text>Vous serez notifiés par email dès que le groupe est approuvé.</Text>
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

export default connect(mapStateToProps)(GroupAddSuccess);
