import React from 'react';
import { View, Platform, FlatList } from 'react-native';
import {
  Divider,
  Button,
  Text,
  TextInput,
  RadioButton,
  List,
  ProgressBar,
  Title,
} from 'react-native-paper';
import { connect } from 'react-redux';

import { Illustration, Modal } from '@components/index';
import getStyles from '@styles/Styles';
import { ModalProps, Account, State, RequestState } from '@ts/types';
import { Errors, trackEvent, useTheme } from '@utils/index';

import { PagesScreenNavigationProp } from '../index';

type AboutModalProps = ModalProps & { navigation: PagesScreenNavigationProp<any> };
const AboutModal: React.FC<AboutModalProps> = ({ visible, setVisible, navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <Modal visible={visible} setVisible={setVisible}>
      <View>
        <View style={[styles.container, styles.centerImageContainer]}>
          <Illustration name="topic-icon" height={100} width={200} />
          <Title>Crééz votre propre site web avec Topic !</Title>
        </View>
        <View style={styles.container}>
          <Text style={{ fontSize: 16 }}>
            Avec Topic, vous pouvez créer un site web pour votre association, votre club, votre
            mini-entreprise...
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, flex: 1 }}>
            <Illustration name="article" height={100} width={100} />
            <Text style={{ fontSize: 16, flex: 1 }}>
              Publiez des articles et des évènements qui seronts visibles à tous les utilisateurs de
              l&apos;application Topic, et ils apparaitront automatiquement sur votre site web.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, flex: 1 }}>
            <Text style={{ fontSize: 16, flex: 1 }}>
              Créez un groupe et ajoutez des membres, avec différents rôles, pour vous aider à
              écrire les articles et représenter votre groupe !
            </Text>
            <Illustration name="group" height={100} width={100} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, flex: 1 }}>
            <Illustration name="location-select" height={100} width={100} />
            <Text style={{ fontSize: 16, flex: 1 }}>
              Donnez un nouveau souffle à l&apos;engagement de la jeunesse, et faites découvrir vos
              initiatives à la France entière !
            </Text>
          </View>
          {/* <View style={[styles.container, { marginTop: 40 }]}>
            <Button mode="contained" onPress={() => {}}>
              Commencer
            </Button>
          </View> */}
        </View>
      </View>
    </Modal>
  );
};

export default AboutModal;
