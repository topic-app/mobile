import React from 'react';
import { View, Platform } from 'react-native';
import { Button, RadioButton, List, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import { updateCreationData } from '@redux/actions/data/account';

import getAuthStyles from '../styles/Styles';

import { ListHeading, ListItem } from './ListComponents';

function AuthCreatePagePrivacy({ prev, next }) {
  const [accountType, setAccountType] = React.useState('private');

  const submit = () => {
    updateCreationData({ accountType });
    if (accountType === 'private') {
      next(2);
    } else {
      next();
    }
  };

  const theme = useTheme();
  const { colors } = theme;
  const authStyles = getAuthStyles(theme);

  const always = {
    icon: 'check',
    iconColor: colors.valid,
  };

  const publicOnly = {
    icon: accountType === 'public' ? 'check' : 'close',
    iconColor: accountType === 'public' ? colors.valid : colors.invalid,
  };

  return (
    <View style={authStyles.formContainer}>
      <View style={authStyles.listContainer}>
        <List.Item
          title="Compte public"
          left={() =>
            Platform.OS !== 'ios' ? (
              <RadioButton
                status={accountType === 'public' ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => setAccountType('public')}
              />
            ) : null
          }
          right={() =>
            Platform.OS === 'ios' ? (
              <RadioButton
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
                status={accountType === 'private' ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => setAccountType('private')}
              />
            ) : null
          }
          right={() =>
            Platform.OS === 'ios' ? (
              <RadioButton
                status={accountType === 'private' ? 'checked' : 'unchecked'}
                color={colors.primary}
                onPress={() => setAccountType('private')}
              />
            ) : null
          }
          onPress={() => setAccountType('private')}
        />
      </View>
      <View style={authStyles.descriptionContainer}>
        <View style={authStyles.descriptionPartContainer}>
          <ListHeading label="Vous pouvez" />
          <ListItem icon={always.icon} iconColor={always.iconColor} label="Créer des pétitions" />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Écrire des articles et créer des évènements si vous appartenez à un groupe"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Signer des pétitions anonymement"
          />
          <ListItem
            icon={publicOnly.icon}
            iconColor={publicOnly.iconColor}
            label="Signer des pétitions publiquement"
          />
          <ListItem
            icon={publicOnly.icon}
            iconColor={publicOnly.iconColor}
            label="Écrire des commentaires"
          />
          <ListItem
            icon={publicOnly.icon}
            iconColor={publicOnly.iconColor}
            label="Être administrateur d'un groupe"
          />
        </View>
        <View style={authStyles.descriptionPartContainer}>
          <ListHeading label="Les autres utilisateurs peuvent" />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Voir votre nom d'utilisateur"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Voir vos articles, évènements et pétitions"
          />
          <ListItem
            icon={always.icon}
            iconColor={always.iconColor}
            label="Voir les groupes auquels vous appartenez"
          />
          <ListItem
            icon={publicOnly.icon}
            iconColor={publicOnly.iconColor}
            label="Voir les contenus auquels vous êtes abonnés"
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
      <View style={authStyles.buttonContainer}>
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
}

export default AuthCreatePagePrivacy;

AuthCreatePagePrivacy.propTypes = {
  next: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};
