import React from 'react';
import { View, Platform } from 'react-native';
import { Button, RadioButton, HelperText, List, Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import { StepperViewPageProps } from '@components/index';
import { updateEventCreationData } from '@redux/actions/contentData/events';
import getStyles from '@styles/Styles';
import { Account, State } from '@ts/types';
import { useTheme } from '@utils/index';

import getAuthStyles from '../styles/Styles';

type Props = StepperViewPageProps & { account: Account };

const EventAddPageGroup: React.FC<Props> = ({ next, account }) => {
  const [group, setGroup] = React.useState(null);
  const [showError, setError] = React.useState(false);

  const submit = () => {
    if (group !== null) {
      updateEventCreationData({ group });
      next();
    } else {
      setError(true);
    }
  };

  const theme = useTheme();
  const { colors } = theme;
  const eventStyles = getAuthStyles(theme);
  const styles = getStyles(theme);
  const groupsWithPermission = account.groups.filter((g) =>
    account.permissions.some((p) => p.group === g._id && p.permission === 'event.add'),
  );

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={eventStyles.formContainer}>
      <View style={eventStyles.listContainer}>
        {groupsWithPermission.map((g) => (
          <List.Item
            key={g._id}
            title={g.name}
            description={`Groupe ${g.type} · Vous êtes ${
              g.roles.find((r) => r._id === g.membership.role)?.name
            }`}
            left={() =>
              Platform.OS !== 'ios' ? (
                <View style={{ justifyContent: 'center' }}>
                  <RadioButton
                    value=""
                    status={group === g._id ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => {
                      setError(false);
                      setGroup(g._id);
                    }}
                  />
                </View>
              ) : null
            }
            right={() =>
              Platform.OS === 'ios' ? (
                <View style={{ justifyContent: 'center' }}>
                  <RadioButton
                    value=""
                    status={group === g._id ? 'checked' : 'unchecked'}
                    color={colors.primary}
                    onPress={() => {
                      setError(false);
                      setGroup(g._id);
                    }}
                  />
                </View>
              ) : null
            }
            onPress={() => {
              setError(false);
              setGroup(g._id);
            }}
          />
        ))}
        <HelperText visible={showError} type="error">
          Vous devez selectionner un groupe
        </HelperText>
        {groupsWithPermission.length !== account.groups.length && (
          <Text>
            Certains groupes n'apparaissent pas car vous ne pouvez pas écrire d'évènements pour ces
            groupes
          </Text>
        )}
      </View>
      <View style={eventStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== 'ios' ? 'contained' : 'outlined'}
          uppercase={Platform.OS !== 'ios'}
          onPress={() => submit()}
          style={{ flex: 1 }}
        >
          Suivant
        </Button>
      </View>
      {Platform.OS !== 'web' && (
        <View style={[styles.container, { marginTop: 40 }]}>
          <Card
            elevation={0}
            style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 5 }}
          >
            <View style={[styles.container, { flexDirection: 'row' }]}>
              <Icon
                name="information"
                style={{ alignSelf: 'center', marginRight: 10 }}
                size={24}
                color={colors.primary}
              />
              <Text style={{ color: colors.primary }}>
                Vous pouvez créer un évènement depuis votre ordinateur en visitant topicapp.fr
              </Text>
            </View>
          </Card>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account } = state;
  return { account };
};

export default connect(mapStateToProps)(EventAddPageGroup);
