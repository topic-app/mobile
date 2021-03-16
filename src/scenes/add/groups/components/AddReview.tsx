import React from 'react';
import { View, Platform } from 'react-native';
import { Button, Text, Divider, Subheading, Title, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { StepperViewPageProps } from '@components';
import { groupAdd } from '@redux/actions/apiActions/groups';
import { clearGroupCreationData } from '@redux/actions/contentData/groups';
import { State, GroupRequestState, GroupCreationData } from '@ts/types';
import { Errors } from '@utils';

import getStyles from '../styles';

type Props = StepperViewPageProps & {
  creationData: GroupCreationData;
  state: GroupRequestState;
  navigation: any;
};

const ArticleAddPageReview: React.FC<Props> = ({ next, prev, creationData, state, navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const add = () => {
    groupAdd({
      name: creationData.name,
      shortName: creationData.shortName,
      summary: creationData.summary,
      location: creationData.location,
      type: creationData.type,
      parser: 'markdown',
      description: creationData.description,
      legal: creationData.legal,
      verification: creationData.verification,
    })
      .then(({ _id }) => {
        navigation.replace('Success', { id: _id, creationData });
        clearGroupCreationData();
      })
      .catch((error) => {
        Errors.showPopup({
          type: 'axios',
          what: 'la création du groupe',
          error,
          retry: add,
        });
      });
  };

  return (
    <View>
      <View style={styles.formContainer}>
        <Title>Informations générales</Title>
        <View style={styles.contentContainer}>
          <Divider style={{ marginBottom: 20 }} />
          <Subheading>Type</Subheading>
          <Text>{creationData.type}</Text>
          <Divider style={{ marginVertical: 20 }} />
          <Subheading>Nom</Subheading>
          <Text>{creationData.name}</Text>
          <Divider style={{ marginVertical: 20 }} />
          <Subheading>Localisation</Subheading>
          <Text>{creationData.locationName}</Text>
          <Divider style={{ marginVertical: 20 }} />
          <Subheading>Acronyme</Subheading>
          <Text>{creationData.shortName || 'Non spécifié'}</Text>
          <Divider style={{ marginVertical: 20 }} />
          <Subheading>Description courte</Subheading>
          <Text>{creationData.summary}</Text>
          <Divider style={{ marginVertical: 20 }} />
          <Subheading>Description longue</Subheading>
          <Text>{creationData.description || 'Non spécifié'}</Text>
        </View>
      </View>
      <Divider style={{ marginTop: 30 }} />
      <View style={styles.formContainer}>
        <View>
          <Title>Informations de vérification</Title>
          <View style={styles.contentContainer}>
            <Divider style={{ marginBottom: 20 }} />
            <Subheading>Nom complet</Subheading>
            <Text>{creationData.legal?.name || 'Non spécifié'}</Text>
            <Divider style={{ marginVertical: 20 }} />
            <Subheading>Identifiant</Subheading>
            <Text>{creationData.legal?.id || 'Non spécifié'}</Text>
            <Divider style={{ marginVertical: 20 }} />
            <Subheading>Responsable légal</Subheading>
            <Text>{creationData.legal?.admin}</Text>
            <Divider style={{ marginVertical: 20 }} />
            <Subheading>Siège social</Subheading>
            <Text>{creationData.legal?.address || 'Non spécifié'}</Text>
            <Divider style={{ marginVertical: 20 }} />
            <Subheading>Adresse email</Subheading>
            <Text>{creationData.legal?.email}</Text>
            <Divider style={{ marginVertical: 20 }} />
            <Subheading>Site web</Subheading>
            <Text>{creationData.legal?.website || 'Non spécifié'}</Text>
            <Divider style={{ marginVertical: 20 }} />
            {creationData.legal?.extra ? (
              <View>
                <Subheading>Données supplémentaires</Subheading>
                <Text>{creationData.legal?.extra}</Text>
                <Divider style={{ marginVertical: 20 }} />
              </View>
            ) : null}
          </View>
        </View>
      </View>
      <View style={styles.formContainer}>
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
            onPress={() => add()}
            style={{ flex: 1, marginLeft: 5 }}
            loading={state.add?.loading}
          >
            Créer
          </Button>
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { groupData, groups } = state;
  return { creationData: groupData.creationData, state: groups.state };
};

export default connect(mapStateToProps)(ArticleAddPageReview);
