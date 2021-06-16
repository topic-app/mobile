import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Divider, List, Subheading, Text, useTheme } from 'react-native-paper';

import contributors from '@assets/json/contributors.json';
import { Illustration } from '@components';
import { handleUrl } from '@utils';

import { AboutScreenNavigationProp } from '..';
import getStyles from '../styles';

type props = {
  navigation: AboutScreenNavigationProp<'Legal'>;
};

const AboutPage: React.FC<props> = ({ navigation }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [lpCount, setLpCount] = React.useState(0);

  return (
    <View>
      <View style={styles.contentContainer}>
        <View style={[styles.centerIllustrationContainer, { marginTop: 60, marginBottom: 10 }]}>
          <Illustration name="topic-icon" style={{ height: 200, width: 200 }} />
        </View>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.centerIllustrationContainer}>
          <Text style={[styles.topic, { fontSize: 60 }]}>Topic</Text>
          <Subheading>La mallette à outils de l&apos;engagement citoyen</Subheading>
        </View>
      </View>
      <View style={{ height: 40 }} />
      <View
        style={[
          { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' },
          styles.container,
        ]}
      >
        <TouchableOpacity onPress={() => navigation.push('Legal', { page: 'mentions' })}>
          <Text style={styles.link}>Mentions légales</Text>
        </TouchableOpacity>
        <Text> - </Text>
        <TouchableOpacity onPress={() => navigation.push('Legal', { page: 'conditions' })}>
          <Text style={styles.link}>Conditions d&apos;utilisation</Text>
        </TouchableOpacity>
        <Text> - </Text>
        <TouchableOpacity onPress={() => navigation.push('Legal', { page: 'confidentialite' })}>
          <Text style={styles.link}>Politique de confidentialité</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
      <Divider />
      <View style={styles.container}>
        <Subheading>Suivez nous sur les réseaux sociaux !</Subheading>
      </View>
      <List.Item
        title="Twitter"
        description="@topic_app"
        onPress={() => handleUrl('https://twitter.com/topic_app', { trusted: true })}
        right={() => <List.Icon icon="twitter" />}
      />
      <List.Item
        title={lpCount > 2 ? 'Amstramgram' : 'Instagram'}
        description="@topic_application"
        onPress={() =>
          handleUrl(
            lpCount > 2
              ? 'https://youtu.be/ZJD1zoAaCmo?t=2'
              : 'https://instagram.com/topic_application',
            { trusted: true },
          )
        }
        onLongPress={() => setLpCount(lpCount + 1)}
        right={() => <List.Icon icon={lpCount > 2 ? 'youtube' : 'instagram'} />}
      />
      <List.Item
        title={lpCount > 2 ? 'Face de book' : 'Facebook'}
        description="Topic App"
        onPress={() =>
          handleUrl(
            lpCount > 2
              ? 'https://youtu.be/uFpKj3JbORs?t=160'
              : 'https://www.facebook.com/Topic-App-108062684848019/',
            { trusted: true },
          )
        }
        right={() => <List.Icon icon={lpCount > 2 ? 'youtube' : 'facebook'} />}
        onLongPress={() => setLpCount(lpCount + 1)}
      />
      <List.Item
        title="Gitlab (code source)"
        description="topicapp"
        onPress={() => handleUrl('https://gitlab.com/topicapp', { trusted: true })}
        right={() => <List.Icon icon="gitlab" />}
      />
      <List.Item
        title={lpCount > 2 ? 'Vous avez découvert un easter egg :)' : 'Serveur de communication'}
        description="chat.topicapp.fr"
        onPress={() => handleUrl('https://chat.topicapp.fr', { trusted: true })}
        right={() => <List.Icon icon="comment-outline" />}
      />
      <View style={{ height: 40 }} />
      <Divider />
      <View style={styles.contentContainer}>
        <Subheading>Équipe et contributeurs</Subheading>
      </View>
      {contributors.map((c) => (
        <List.Item
          key={c.name}
          title={c.name}
          description={c.description}
          onPress={c.link ? () => handleUrl(c.link, { trusted: true }) : undefined}
          right={c.icon ? () => <List.Icon icon={c.icon} /> : undefined}
        />
      ))}
      <View style={{ height: 40 }} />
      <Divider />
      <View style={[styles.container, { alignItems: 'center', flexDirection: 'row' }]}>
        <Illustration name="beta-welcome" height={70} width={70} />
        <Text style={{ marginLeft: 10, flex: 1 }}>
          Un grand merci à toute l&apos;équipe, aux bêta-testeurs, à nos sponsors et à tous ceux qui
          nous ont aidé à réaliser ce projet !
        </Text>
      </View>
      <View style={{ height: 40 }} />
    </View>
  );
};

export default AboutPage;
