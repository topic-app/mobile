import React from 'react';
import { View, Platform } from 'react-native';
import { Text, TextInput, HelperText, Button, Snackbar, RadioButton, Paragraph } from 'react-native-paper';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateCreationData } from '../../../redux/actions/account';

import { styles, colors } from '../../../styles/Styles';
import { theme } from '../../../styles/Theme';
import { authStyles } from '../styles/Styles';

class AuthCreatePagePrivacy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountType: "private"
    }
  }

  submit = () => {
    const { accountType } = this.state;
    const { forward, skip } = this.props;
    updateCreationData({ accountType })
    if (accountType === "private") { skip() } else { forward() }
  }

  render() {
    const { accountType } = this.state;
    const { backward } = this.props;

    return (
      <View style={authStyles.formContainer}>
        <View style={authStyles.listContainer}>
          <RadioButton.Group
            onValueChange={value => {this.setState({ accountType: value })}}
            value={accountType}
          >
            <RadioButton.Item value="public" label="Compte public" labelStyle={styles.text}/>
            <RadioButton.Item value="private" label="Compe privé" />
          </RadioButton.Group>
        </View>
        <View style={authStyles.descriptionContainer}>
          { accountType === "private" ? (
            <View>
              <View style={authStyles.descriptionPartContainer}>
                <Text>Vous pouvez: </Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Créer des pétitions</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Écrire des articles et créer des évènements si vous appartenez à un groupe</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Signer des pétitions anonymement</Text>
                <Text><Icon size={15} color={colors.text} name="close" /> Signer des pétitions publiquement</Text>
                <Text><Icon size={15} color={colors.text} name="close" /> Écrire des commentaires</Text>
                <Text><Icon size={15} color={colors.text} name="close" /> Etre administrateur d&apos;un groupe</Text>
              </View>
              <View  style={authStyles.descriptionPartContainer}>
                <Text>Les autres utilisateurs peuvent: </Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir votre nom d&apos;utilisateur</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir vos articles, pétitions, et commentaires</Text>
                <Text><Icon size={15} color={colors.text} name="close" /> Voir les contenus auquels vous êtes abonnés</Text>
                <Text><Icon size={15} color={colors.text} name="close" /> Voir votre école</Text>
                <Text><Icon size={15} color={colors.text} name="close" /> Voir votre nom et prénom</Text>
                <Text><Icon size={15} color={colors.text} name="close" /> Voir les groupes auquels vous appartenez</Text>
              </View>
            </View>
          ) : (
            <View>
              <View style={authStyles.descriptionPartContainer}>
                <Text>Vous pouvez: </Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Créer des pétitions</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Écrire des articles et créer des évènements si vous appartenez à un groupe</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Signer des pétitions anonymement</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Signer des pétitions publiquement</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Écrire des commentaires</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Etre administrateur d&apos;un groupe</Text>
              </View>
              <View  style={authStyles.descriptionPartContainer}>
                <Text>Les autres utilisateurs peuvent: </Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir votre nom d&apos;utilisateur</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir vos articles, pétitions, et commentaires</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir les contenus auquels vous êtes abonnés</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir votre école</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir votre nom et prénom</Text>
                <Text><Icon size={15} color={colors.valid} name="check" /> Voir les groupes auquels vous appartenez</Text>
              </View>
            </View>
          )}
        </View>
        <View style={authStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== "ios" ? "outlined": "text"}
            uppercase={Platform.OS !== "ios"}
            onPress={() => backward()}
            style={{flex: 1, marginRight: 5}}
          >
            Retour
          </Button>
          <Button
            mode={Platform.OS !== "ios" ? "contained": "outlined"}
            uppercase={Platform.OS !== "ios"}
            onPress={() => this.submit()}
            style={{flex: 1, marginLeft: 5}}
          >
            Suivant
          </Button>
        </View>
      </View>
    )
  }
}

export default AuthCreatePagePrivacy;

AuthCreatePagePrivacy.propTypes = {
  forward: PropTypes.func.isRequired,
  backward: PropTypes.func.isRequired,
  skip: PropTypes.func.isRequired,
};
