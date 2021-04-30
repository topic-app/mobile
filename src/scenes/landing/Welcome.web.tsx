import { throttle } from 'lodash';
import React, { useCallback, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Divider, Text, Title, Button, useTheme, Searchbar } from 'react-native-paper';
import { animated, useTransition } from 'react-spring';

import { Illustration } from '@components';
import { IllustrationName } from '@components/Illustration';
import { updateDepartments } from '@redux/actions/api/departments';
import { trackEvent } from '@utils';

import type { LandingScreenNavigationProp } from '.';
import getStyles from './styles';

type TileProps = {
  illustration: IllustrationName;
  text: string;
  onPress: () => any;
};

const Tile: React.FC<TileProps> = ({ illustration, text, onPress }) => {
  // val -> (val+1)%360 val = 0|1|2|3|...|358|359|0|1;
  // Math.abs(tilenumber-val)<360/4|>3*360/4
  return (
    <Button onPress={() => onPress()}>
      <View>
        <Illustration name={illustration} />
        <Text style={{ textAlign: 'center' }}>{text}</Text>
      </View>
    </Button>
  );
};

const tileData: { text: string; illustration: IllustrationName }[] = [
  {
    text: 'hello 1',
    illustration: 'event',
  },
  {
    text: 'hello 2',
    illustration: 'article',
  },
  {
    text: 'hello 3',
    illustration: 'auth-login',
  },
  {
    text: 'hello 4',
    illustration: 'beta-messages',
  },
];

type LandingWelcomeProps = {
  navigation: LandingScreenNavigationProp<'Welcome'>;
};

const LandingWelcome: React.FC<LandingWelcomeProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
    trackEvent('firstopen');
  }, []);

  const [index, setIndex] = useState(0);

  const handlePrev = useCallback(
    throttle(() => setIndex((state) => (state - 1) % tileData.length), 500),
    [setIndex],
  );

  const handleNext = useCallback(
    throttle(() => setIndex((state) => (state + 1) % tileData.length), 500),
    [setIndex],
  );

  const transitions = useTransition([tileData[index]], {
    from: { opacity: 0, transform: 'translateX(-100px)' },
    enter: { opacity: 1, transform: 'translateX(0px)' },
    leave: { opacity: 0, transform: 'translateX(100px)' },
    delay: 1500,
  });

  return (
    <View style={{ backgroundColor: colors.background, width: '100vw', height: '100vh' }}>
      <View style={{ width: '100%', height: '80px', backgroundColor: colors.appBar }}>
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <View style={{ margin: 10 }}>
            <Illustration name="topic-icon" height={50} width={50} />
          </View>
          <Text style={[styles.title, { fontSize: 30 }]}>Topic</Text>
          <View
            style={[{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 10 }]}
          >
            <Button
              style={{ height: 35, margin: 5 }}
              mode="outlined"
              onPress={() =>
                navigation.navigate('Auth', {
                  screen: 'Login',
                })
              }
            >
              Se connecter
            </Button>
            <Button
              style={{ height: 35, margin: 5, marginRight: 10 }}
              mode="contained"
              onPress={() => {
                navigation.navigate('Beta');
              }}
            >
              Créer un compte
            </Button>
          </View>
        </View>
        <Divider />
      </View>
      <ScrollView>
        <View style={{ height: 'calc(100vh - 80px)', width: '100%' }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Title style={[styles.title, { fontSize: 30, marginTop: 20 }]}>
                Choisissez votre école
              </Title>
              <View style={{ width: 400, marginVertical: 20 }}>
                <Searchbar
                  placeholder="Rechercher"
                  onChangeText={() => {
                    console.log(this);
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {transitions(({ opacity, transform }, props) => (
                <animated.div
                  style={{
                    opacity,
                    transform,
                    position: 'absolute',
                  }}
                >
                  <Tile {...props} onPress={handleNext} />
                </animated.div>
              ))}
            </View>
          </View>
        </View>
        <View
          style={{
            height: 'calc(100vh - 80px)',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text>Page 2!</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LandingWelcome;
