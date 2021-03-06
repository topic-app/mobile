import { CompositeNavigationProp } from '@react-navigation/core';
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Subheading, List, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Modal } from '@components';
import getStyles from '@styles/global';
import {
  ModalProps,
  State,
  Group,
  GroupPreload,
  ReduxLocation,
  GroupRolePermission,
} from '@ts/types';
import { Permissions } from '@utils';

type ChangeGroupLocationModalProps = ModalProps & {
  group: Group | GroupPreload | null;
  navigation: CompositeNavigationProp<any, any>;
};

const ChangeGroupLocationModal: React.FC<ChangeGroupLocationModalProps> = ({
  visible,
  setVisible,
  group,
  navigation,
}) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const articlePermission = group?.preload
    ? null
    : group?.permissions?.find((p) => p.permission === Permissions.ARTICLE_ADD)?.scope;
  const eventPermission = group?.preload
    ? null
    : group?.permissions?.find((p) => p.permission === Permissions.EVENT_ADD)?.scope;
  const placePermission = group?.preload
    ? null
    : group?.permissions?.find((p) => p.permission === Permissions.PLACE_ADD)?.scope;

  const locs: {
    key: string;
    name: string;
    showEverywhere?: boolean;
    data: ReduxLocation | GroupRolePermission['scope'] | null | undefined;
    callback: (location: ReduxLocation) => any;
  }[] = [
    {
      key: 'localisation',
      name: 'Localisation',
      showEverywhere: false,
      data: group?.preload
        ? null
        : {
            schools: group?.location?.schools?.map((s) => s._id),
            departments: group?.location?.departments?.map((d) => d._id),
            global: group?.location?.global,
          },
      callback: (l) => {},
    },
    {
      key: 'articles',
      name: 'Articles',
      data: articlePermission,
      callback: (l) => {},
    },
    {
      key: 'events',
      name: 'Évènements',
      data: eventPermission,
      callback: (l) => {},
    },
    {
      key: 'places',
      name: 'Places',
      data: placePermission,
      callback: (l) => {},
    },
  ];

  return (
    <Modal visible={visible} setVisible={setVisible}>
      {group?.preload ? (
        <Text>Chargement...</Text>
      ) : (
        <View>
          <ScrollView style={{ height: 600 }}>
            <View style={styles.container}>
              {locs.map((l) => (
                <View>
                  <Subheading>{l.name}</Subheading>
                  <List.Item
                    title="Écoles"
                    description={group?.preload ? 'Chargement...' : l.data?.schools?.join(', ')}
                    onPress={() =>
                      navigation.push('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'More',
                          params: {
                            screen: 'Location',
                            params: {
                              type: 'schools',
                              subtitle: 'Modifier un groupe',
                              showEverywhere: l.showEverywhere || true,
                              initialData: { ...l.data },
                              callback: l.callback,
                            },
                          },
                        },
                      })
                    }
                  />
                  <List.Item
                    title="Départements"
                    description={group?.preload ? 'Chargement...' : l.data?.departments?.join(', ')}
                    onPress={() =>
                      navigation.push('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'More',
                          params: {
                            screen: 'Location',
                            params: {
                              type: 'departements',
                              subtitle: 'Modifier un groupe',
                              initialData: { ...l.data },
                              callback: l.callback,
                            },
                          },
                        },
                      })
                    }
                  />
                  <List.Item
                    title="Régions"
                    description={group?.preload ? 'Chargement...' : l.data?.departments?.join(', ')}
                    onPress={() =>
                      navigation.push('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'More',
                          params: {
                            screen: 'Location',
                            params: {
                              type: 'regions',
                              subtitle: 'Modifier un groupe',
                              showEverywhere: l.showEverywhere || true,
                              initialData: { ...l.data },
                              callback: l.callback,
                            },
                          },
                        },
                      })
                    }
                  />
                  <List.Item
                    title="Autres"
                    description={group?.preload ? 'Chargement...' : l.data?.schools?.join(', ')}
                    onPress={() =>
                      navigation.push('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'More',
                          params: {
                            screen: 'Location',
                            params: {
                              type: 'other',
                              subtitle: 'Modifier un groupe',
                              showEverywhere: l.showEverywhere || true,
                              initialData: { ...l.data },
                              callback: l.callback,
                            },
                          },
                        },
                      })
                    }
                  />
                  <List.Item title="Toutes les localisations" />
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={styles.container}>
            <Button mode="contained">Changer</Button>
          </View>
        </View>
      )}
    </Modal>
  );
};

const mapStateToProps = (state: State) => {
  const { groups } = state;
  return {
    state: groups.state,
  };
};

export default connect(mapStateToProps)(ChangeGroupLocationModal);
