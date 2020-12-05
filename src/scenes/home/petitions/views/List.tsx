import React from 'react';
import { View, Animated } from 'react-native';
import { Button, FAB } from 'react-native-paper';
import { connect } from 'react-redux';

import UnauthorizedBeta from '@components/UnauthorizedBeta';
import { PetitionCard, AnimatingHeader } from '@components/index';
import getStyles from '@styles/Styles';
import { Petition, PetitionPreload, State } from '@ts/types';
import { useTheme } from '@utils/index';

import { HomeTwoScreenNavigationProp } from '../../HomeTwo';

type PetitionListProps = {
  navigation: HomeTwoScreenNavigationProp<'Petition'>;
  petitions: (PetitionPreload | Petition)[];
};

const PetitionList: React.FC<PetitionListProps> = ({ navigation, petitions }) => {
  return <UnauthorizedBeta back={navigation.goBack} />;

  // eslint-disable-next-line no-unreachable
  const theme = useTheme();

  const scrollY = new Animated.Value(0);
  const styles = getStyles(theme);

  return (
    <View style={styles.page}>
      <AnimatingHeader
        home
        value={scrollY}
        title="Pétitions"
        actions={[
          {
            icon: 'magnify',
            onPress: () =>
              navigation.navigate('Main', {
                screen: 'Search',
                params: {
                  screen: 'Search',
                  params: { initialCategory: 'petitions', previous: 'Pétitions' },
                },
              }),
          },
        ]}
        overflow={[{ title: 'Hello', onPress: () => console.log('Hello') }]}
      />
      <Animated.FlatList
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        data={petitions}
        refreshing={false}
        onRefresh={() => console.log('Refresh: Need to make server request')}
        keyExtractor={(petition) => petition._id}
        ListFooterComponent={
          <View style={styles.container}>
            <Button>Retour en haut</Button>
          </View>
        }
        renderItem={(petition) => (
          <PetitionCard
            petition={petition.item}
            navigate={() =>
              navigation.navigate('Main', {
                screen: 'Display',
                params: {
                  screen: 'Petition',
                  params: {
                    screen: 'Display',
                    params: {
                      id: petition.item._id,
                      title: petition.item.title,
                      previous: 'Pétitions',
                    },
                  },
                },
              })
            }
          />
        )}
      />
      <FAB
        icon="plus"
        onPress={() =>
          navigation.navigate('Main', {
            screen: 'Add',
            params: {
              screen: 'Petition',
              params: {
                screen: 'Add',
              },
            },
          })
        }
        style={styles.bottomRightFab}
      />
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { petitions } = state;
  return { petitions: petitions.data, state: petitions.state };
};

export default connect(mapStateToProps)(PetitionList);
