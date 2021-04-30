import { values } from 'lodash';
import React from 'react';
import { View, Platform } from 'react-native';
import { Divider, Text, Title, Button, useTheme, Searchbar } from 'react-native-paper';

import { Illustration, TranslucentStatusBar } from '@components';
import { updateDepartments } from '@redux/actions/api/departments';
import { trackEvent } from '@utils';

import type { LandingScreenNavigationProp } from '.';
import getStyles from './styles';

type LandingWelcomeProps = {
  navigation: LandingScreenNavigationProp<'Welcome'>;
};

const LandingWelcome: React.FC<LandingWelcomeProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  React.useEffect(() => {
    // Preload écoles & departments pour utiliser après dans SelectLocation
    updateDepartments('initial');
    trackEvent('firstopen');
  }, []);

  const Animation: (
    start: number,
    setV: (i: number) => void,
    v: number,
  ) => {
    input: number;
    value: number;
    setVal: (t: number) => void;
    bool: boolean;
  } = (start, setV, v) => {
    return {
      input: start,
      value: v,
      setVal: setV,
      bool: !0,
    };
  };

  const startAnimation: (
    e: {
      value: number;
      setVal: (t: number) => void;
      bool: boolean;
    },
    stop: number,
    step: number | ((i: number) => number),
  ) => void = (e, stop, step) => {
    e.setVal(typeof step === 'number' ? (e.value += step) : (e.value = step(e.value)));
    // console.log(e.value, Math.round(e.value * 1e3) / 1e3, stop);
    if (e.bool) {
      if (Math.round(e.value * 1e2) / 1e2 !== stop) {
        requestAnimationFrame(() => {
          startAnimation(e, stop, step);
        });
      }
    } else e.bool = true;
  };

  const [val, setV] = React.useState(0);
  const valchange = Animation(0, setV, val);

  const moveLeft: () => void = () => {
    startAnimation(valchange, (valchange.value + 3) % 4, (i) => (i - 1e-2 + 4) % 4);
  };

  const moveRight: () => void = () => {
    console.log('hi');
    startAnimation(valchange, (valchange.value + 1) % 4, (i) => (i + 1e-2) % 4);
  };

  type TileProps = {
    text?: string;
    tilenumber?: number;
    name: 'article' | 'event' | 'explore' | 'group';
    onPress?: () => void;
  };

  const Tile: React.FC<TileProps> = ({ text = '', tilenumber = 0, name, onPress }) => {
    // val -> (val+1)%360 val = 0|1|2|3|...|358|359|0|1;
    // Math.abs(tilenumber-val)<360/4|>3*360/4
    return (
      <Button
        onPress={() => moveRight()}
        style={{
          position: tilenumber === 0 ? 'relative' : 'absolute',
          left: ((val + ((tilenumber + 2) % 4) - 2) * window.innerWidth) / 2,
        }}
      >
        <View
        // style={{
        //   translateX: 200, // ((val + ((tilenumber + 2) % 4) - 2) * window.innerWidth) / 2,
        // }}
        >
          <Illustration name={name} />
          <Text style={{ textAlign: 'center' }}>{text}</Text>
        </View>
      </Button>
    );
  };

  return (
    <View style={styles.page}>
      <TranslucentStatusBar />
      <View>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ margin: 10 }}>
            <Illustration name="topic-icon" style={{ height: 50, width: 50 }} />
          </View>
          <Text style={[styles.title, { fontSize: 30, marginTop: 15 }]}>Topic</Text>
          <View
            style={[{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginTop: 10 }]}
          >
            <Button
              style={{ height: 35, margin: 5 }}
              mode="contained"
              uppercase={Platform.OS !== 'ios'}
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
              uppercase={Platform.OS !== 'ios'}
              onPress={() => {
                navigation.navigate('Beta');
              }}
            >
              Créer un compte
            </Button>
          </View>
        </View>
      </View>
      <View>
        <Divider />
        <View style={{ display: 'flex', flexWrap: 'wrap', height: 'calc(100% - 50px)' }}>
          <View
            style={{
              width: '50vw',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Title style={[styles.title, { fontSize: 30, alignSelf: 'center', marginTop: 20 }]}>
              Choisissez votre école
            </Title>
            <View style={{ width: 400, marginVertical: 20, alignSelf: 'center' }}>
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
              width: '50vw',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Tile text="hello" name="event" tilenumber={0} onPress={moveRight} />
            <Tile text="hi" name="article" tilenumber={1} onPress={moveRight} />
            <Tile text="world" name="article" tilenumber={2} onPress={moveRight} />
            <Tile text="mushroom" name="article" tilenumber={3} onPress={moveRight} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LandingWelcome;
