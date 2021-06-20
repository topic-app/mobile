import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { Platform, View, ScrollView } from 'react-native';
import { Text, Button, Divider, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration } from '@components';
import { State, ArticleRequestState, Account } from '@ts/types';

import type { GroupAddScreenNavigationProp, GroupAddStackParams } from '.';
import getStyles from './styles';

type GroupAddSuccessProps = {
  reqState: ArticleRequestState;
  account: Account;
  navigation: GroupAddScreenNavigationProp<'Success'>;
  route: RouteProp<GroupAddStackParams, 'Success'>;
};

const GroupAddSuccess: React.FC<GroupAddSuccessProps> = ({
  navigation,
  reqState,
  account,
  route,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <ScrollView>
        <View style={[styles.centerIllustrationContainer, { marginTop: 40 }]}>
          <Illustration name="auth-register-success" height={200} width={200} />
          <Text style={styles.title}>Groupe en attente de vérification</Text>
          <View>
            <Text style={{ marginTop: 40 }}>
              Votre groupe doit être approuvé par un administrateur.
            </Text>
            <Text>Vous serez notifié par email dès que le groupe sera approuvé.</Text>
          </View>
        </View>
      </ScrollView>
      <Divider />
      <View style={styles.formContainer}>
        <View style={styles.buttonContainer}>
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
