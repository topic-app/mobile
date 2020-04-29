import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { Text, List, Divider, Button, useTheme } from 'react-native-paper';
import getStyles from '@styles/Styles';
import Content from '@components/Content';

function EventDisplayDescription({ description }) {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;
  return (
    <View style={styles.contentContainer}>
      <List.Item
        left={() => <List.Icon color={colors.text} icon="map-marker" />}
        title="Centre International de Valbonne"
        description="190 Rue Frédéric Mistral, Sophia-Antipolis"
        right={() => (
          <Button
            style={{ alignSelf: 'center', width: 140 }}
            mode={Platform.OS !== 'ios' ? 'contained' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {}}
          >
            Carte
          </Button>
        )}
      />
      <List.Item
        left={() => <List.Icon color={colors.text} icon="calendar" />}
        title="Du 25 au 28 juin 2020"
        description="De 10h à 21h tous les jours"
        right={() => (
          <Button
            style={{ alignSelf: 'center', width: 140 }}
            mode={Platform.OS !== 'ios' ? 'contained' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {}}
          >
            Programme
          </Button>
        )}
      />
      <List.Item
        left={() => <List.Icon color={colors.text} icon="school" />}
        title="Organisé par Aseica"
        description="aseica.org"
        right={() => (
          <Button
            style={{ alignSelf: 'center', width: 140 }}
            mode={Platform.OS !== 'ios' ? 'contained' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {}}
          >
            Suivre
          </Button>
        )}
      />
      <List.Item
        left={() => <List.Icon color={colors.text} icon="currency-eur" />}
        title="Participation gratuite"
        description="Éléments payants"
        right={() => (
          <Button
            style={{ alignSelf: 'center', width: 140 }}
            mode={Platform.OS !== 'ios' ? 'contained' : 'text'}
            uppercase={Platform.OS !== 'ios'}
            onPress={() => {}}
          >
            S&apos;inscrire
          </Button>
        )}
      />
      <Divider />
      <Content parser={description.parser || 'plaintext'} data={description.data} />
    </View>
  );
}

export default EventDisplayDescription;

EventDisplayDescription.propTypes = {
  description: PropTypes.shape({
    parser: PropTypes.oneOf(['plaintext', 'markdown']).isRequired,
    data: PropTypes.string.isRequired,
  }).isRequired,
};
