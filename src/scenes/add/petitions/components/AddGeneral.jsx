import React from 'react';
import { View, Platform } from 'react-native';
import { TextInput, HelperText, Button, List, Divider, Text, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

import { updateCreationData, updateState } from '@redux/actions/data/account';
import request from '@utils/request';
import PetitionCard from '../../../home/petitions/components/Card';
import getPetitionAddStyles from '../styles/Styles';

class AuthCreatePageGeneral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      titleError: false,
      titleValid: false,
      titleErrorMessage: '',
    };

    this.emailInput = React.createRef();
  }

  validateTitleInput = async (title) => {
    let validation = { titleValid: false, titleError: false };

    if (title !== '') {
      if (title.length < 20) {
        validation = {
          titleValid: false,
          titleError: true,
          titleErrorMessage: 'Le titre doit contenir au moins 20 caractères',
        };
      } else {
        validation = {
          titleValid: true,
          titleError: false,
          titleErrorMessage: '',
        };
      }
    }

    this.setState(validation);
    return validation;
  };

  preValidateTitleInput = async (title) => {
    if (title.length >= 3 && title.match(/^[a-zA-Z0-9_.]+$/i) !== null) {
      this.setState({ titleValid: false, titleError: false });
    }
  };

  blurInputs = () => {
    this.titleInput.current.blur();
  };

  submit = async () => {
    updateState({ loading: true }); // Do we need this anymore?

    const title = this.titleInput.current.state.value;

    const { forward } = this.props;

    const { titleValid, titleError } = await this.validateTitleInput(title);
    if (titleValid) {
      this.blurInputs();
      // TODO: Update data
      forward();
    } else {
      const result = {};
      if (!titleValid && !titleError) {
        result.titleValid = false;
        result.titleError = true;
        result.titleErrorMessage = 'Titre requis';
      }
      this.setState(result);
    }
    updateState({ loading: false }); // Same here: do we need this?
  };

  render() {
    const { title, titleError, titleErrorMessage, titleValid } = this.state;

    const { theme } = this.props;
    const { colors } = theme;
    const petitionAddStyles = getPetitionAddStyles(theme);

    return (
      <View style={petitionAddStyles.formContainer}>
        <View style={petitionAddStyles.textInputContainer}>
          <TextInput
            ref={this.titleInput}
            label="Titre de la pétition"
            value={title}
            error={titleError}
            disableFullscreenUI
            onSubmitEditing={(info) => {
              this.validateTitleInput(info.nativeEvent.text);
              this.emailInput.current.focus();
            }}
            autoFocus
            theme={
              titleValid
                ? { colors: { primary: colors.primary, placeholder: colors.valid } }
                : theme
            }
            mode="outlined"
            onEndEditing={(info) => {
              this.validateTitleInput(info.nativeEvent.text);
            }}
            style={petitionAddStyles.textInput}
            onChangeText={(text) => {
              this.setState({ title: text });
              this.preValidateTitleInput(text);
            }}
          />
          <HelperText type="error" visible={titleError}>
            {titleErrorMessage}
          </HelperText>
        </View>
        <Divider />
        <View style={petitionAddStyles.warningContainer}>
          <Text>
            Des pétitions similaires existent. Vous pouvez les signer au lieu de créer une nouvelle
            pétition.
          </Text>
        </View>
        <View style={petitionAddStyles.cardContainer}>
          <PetitionCard
            petition={{
              _id: '1',
              title: 'Mettons fin au gaspillage allimentaire au CIV',
              description: 'Trop de pigeons ont veut les manger',
              status: 'open',
              voteData: {
                type: 'goal',
                votes: 600,
                goal: 2000,
              },
              duration: {
                start: '2020-03-30T19:25:43.511Z',
                end: '2020-04-30T19:25:43.511Z',
              },
              location: {
                global: false,
                schools: [
                  {
                    _id: '312321312',
                    displayName: 'Pasteur',
                  },
                ],
                departments: [
                  {
                    _id: '412341234',
                    displayName: 'Pacman',
                  },
                ],
              },
              publisher: {
                type: 'user',
                user: {
                  _id: '428934812395',
                  displayName: 'Axel Martin',
                },
              },
              tags: [
                {
                  displayName: 'environnement',
                  color: 'red',
                  _id: '140930',
                },
                {
                  displayName: 'developpement durable',
                  color: 'blue',
                  _id: '5198312941723',
                },
                {
                  displayName: "D'Accord",
                  color: 'purple',
                  _id: '104243275932',
                },
                {
                  displayName: 'Que',
                  color: 'yellow',
                  _id: '51438597234981',
                },
                {
                  displayName: 'Le',
                  color: 'orange',
                  _id: '51284935782934',
                },
                {
                  displayName: 'Chat',
                  color: 'cyan',
                  _id: '19237432582',
                },
                {
                  displayName: "D'Alex",
                  color: 'purple',
                  _id: '519235834930295',
                },
                {
                  displayName: 'Est',
                  color: 'green',
                  _id: '192358341237592',
                },
                {
                  displayName: 'Trop',
                  color: 'pink',
                  _id: '152938412375923',
                },
                {
                  displayName: 'Mignon',
                  color: 'black',
                  _id: '49123573294231049',
                },
              ],
            }}
            navigate={() => {}}
          />
        </View>
        <Divider />
        <View style={petitionAddStyles.buttonContainer}>
          <Button
            mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {
              this.submit();
            }}
            style={{ flex: 1 }}
          >
            Suivant
          </Button>
        </View>
      </View>
    );
  }
}

export default withTheme(AuthCreatePageGeneral);

AuthCreatePageGeneral.propTypes = {
  forward: PropTypes.func.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
