import React from 'react';
import { View, Platform } from 'react-native';
import { Button, RadioButton, List, useTheme } from 'react-native-paper';

import { StepperViewPageProps } from '@components';
import { updateCreationData } from '@redux/actions/data/account';
import { trackEvent } from '@utils';

import getStyles from '../styles';
import { ListHeading, ListItem } from './ListComponents';

type Props = StepperViewPageProps;

const AuthCreatePagePrivacy: React.FC<Props> = ({ prev, next }) => {
  const [accountType, setAccountType] = React.useState<'private' | 'public'>('private');

  const submit = () => {
    updateCreationData({ accountType });
    trackEvent('auth:create-page-profile');
    next();
  };

  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  const always = {
    icon: 'check',
    iconColor: colors.valid,
  };

  const publicOnly = {
    icon: accountType === 'public' ? 'check' : 'close',
    iconColor: accountType === 'public' ? colors.valid : colors.invalid,
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.listContainer}>
        <List.Item
          title="Compte public"
          left={() =>
            Platform.OS !== 'ios' ? (
              <RadioButton
                value=""
                status={accountType === 'public' ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => setAccountType('public')}
              />
            ) : null
          }
          right={() =>
            Platform.OS === 'ios' ? (
              <RadioButton
                value=""
                status={accountType === 'public' ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => setAccountType('public')}
              />
            ) : null
          }
          onPress={() => setAccountType('public')}
        />
        <List.Item
          title="Compte privé"
          left={() =>
            Platform.OS !== 'ios' ? (
              <RadioButton
                value=""
                status={accountType === 'private' ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => setAccountType('private')}
              />
            ) : null
          }
          right={() =>
            Platform.OS === 'ios' ? (
              <RadioButton
                value=""
                status={accountType === 'private' ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => setAccountType('private')}
              />
            ) : null
          }
          onPress={() => setAccountType('private')}
        />
      </View>
      <View style={styles.descriptionContainer}>
        <View style={styles.descriptionPartContainer}>
          <ListHeading label="Vous pouvez" />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Voir tous les articles et évènements"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Suivre des utilisateurs et des groupes"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Écrire des commentaires"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Rejoindre et créer des groupes"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Écrire des articles et créer des évènements si vous appartenez à un groupe"
          />
        </View>
        <View style={styles.descriptionPartContainer}>
          <ListHeading label="Les autres utilisateurs peuvent" />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Voir votre nom d'utilisateur"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Voir vos articles et vos évènements"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Voir les groupes auquels vous appartenez"
          />
          <ListItem
            icon={publicOnly.icon}
            iconColor={publicOnly.iconColor}
            label="Voir les groupes et utilisateurs auquels vous êtes abonnés"
          />
          <ListItem
            icon={publicOnly.icon}
            iconColor={publicOnly.iconColor}
            label="Voir votre école"
          />
          <ListItem
            icon={publicOnly.icon}
            iconColor={publicOnly.iconColor}
            label="Voir votre nom et prénom"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => prev()}
          style={{ flex: 1, marginRight: 5 }}
        >
          Retour
        </Button>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => submit()}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

export default AuthCreatePagePrivacy;
