import React from 'react';
import { View, Platform } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import { updateCreationData } from '../../../redux/actions/account';

import { styles, colors } from '../../../styles/Styles';
import { authStyles } from '../styles/Styles';

import { ListHeading, ListItem } from './ListComponents';

class AuthCreatePagePrivacy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountType: 'private',
    };
  }

  submit = () => {
    const { accountType } = this.state;
    const { forward, skip } = this.props;
    updateCreationData({ accountType });
    if (accountType === 'private') {
      skip();
    } else {
      forward();
    }
  };

  render() {
    const { accountType } = this.state;
    const { backward } = this.props;

    const always = {
      icon: 'check',
      iconColor: colors.valid,
    };

    const publicOnly = {
      icon: accountType.public ? 'check' : 'close',
      iconColor: accountType.public ? colors.valid : colors.invalid,
    };

    return (
      <View style={authStyles.formContainer}>
        <View style={authStyles.listContainer}>
          <RadioButton.Group
            onValueChange={(value) => {
              this.setState({ accountType: value });
            }}
            value={accountType}
          >
            <RadioButton.Item value="public" label="Compte public" labelStyle={styles.text} />
            <RadioButton.Item value="private" label="Compe privé" />
          </RadioButton.Group>
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
            <ListItem
              icon={publicOnly.icon}
              iconColor={publicOnly.iconColor}
              label="Voir les groupes auquels vous appartenez"
            />
          </View>
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'outlined' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => backward()}
            style={{ flex: 1, marginRight: 5 }}
          >
            Retour
          </Button>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => this.submit()}
            style={{ flex: 1, marginLeft: 5 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    );
  }
}

export default AuthCreatePagePrivacy;

AuthCreatePagePrivacy.propTypes = {
  forward: PropTypes.func.isRequired,
  backward: PropTypes.func.isRequired,
  skip: PropTypes.func.isRequired,
};
