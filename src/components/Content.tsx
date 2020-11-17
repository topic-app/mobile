import React from 'react';
import { ImageStyle, View, Dimensions } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { connect } from 'react-redux';
import YouTube from 'react-native-youtube';

import { Content as ContentType, State, Preferences } from '@ts/types';
import { useTheme, getImageUrl, handleUrl } from '@utils/index';
import getStyles from '@styles/Styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import updatePrefs from '@redux/actions/data/prefs';
import config from '@constants/config';
import AutoHeightImage from 'react-native-auto-height-image';
import { PlatformTouchable } from './PlatformComponents';
import { useNavigation } from '@react-navigation/core';

type Props = ContentType & { preferences: Preferences };

const Content: React.FC<Props> = ({ parser, data, preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const navigation = useNavigation();

  if (parser === 'markdown') {
    return (
      <Markdown
        markdownit={MarkdownIt({
          html: false,
          breaks: true,
          linkify: true,
        }).disable(['html_block', 'html_inline'])}
        style={{
          body: {
            ...styles.text,
            fontSize: preferences.fontSize,
            fontFamily: preferences.fontFamily,
          },
          link: styles.primaryText,
          heading1: { fontSize: Math.floor(preferences.fontSize * 2) },
          heading2: { fontSize: Math.floor(preferences.fontSize * 1.8) },
          heading3: { fontSize: Math.floor(preferences.fontSize * 1.5) },
          heading4: { fontSize: Math.floor(preferences.fontSize * 1.2) },
          heading5: { fontSize: preferences.fontSize },
          heading6: { fontSize: Math.floor(preferences.fontSize * 0.7) },
          strong: preferences.stripFormatting ? { fontWeight: 'normal' } : {},
          em: preferences.stripFormatting ? { fontStyle: 'normal' } : {},
          s: preferences.stripFormatting ? { textDecorationLine: 'none' } : {},
          blockquote: {
            borderColor: colors.primary,
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: colors.surface,
            fontStyle: preferences.stripFormatting ? 'normal' : 'italic',
          },
        }}
        rules={{
          image: (node, _children, _parent, imageStyles: { [key: string]: ImageStyle }) => {
            const { src } = node.attributes;

            if (src.startsWith('cdn://')) {
              return (
                <View style={[styles.image, { minHeight: 150 }]} key={node.key}>
                  <PlatformTouchable
                    onPress={() =>
                      navigation.push('Main', {
                        screen: 'Display',
                        params: {
                          screen: 'Image',
                          params: {
                            screen: 'Display',
                            params: { image: src.substring(6) },
                          },
                        },
                      })
                    }
                  >
                    <AutoHeightImage
                      style={imageStyles._VIEW_SAFE_image}
                      source={{ uri: getImageUrl({ image: src.substring(6), size: 'full' }) || '' }}
                      width={Dimensions.get('window').width - 50}
                      maxHeight={400}
                    />
                  </PlatformTouchable>
                </View>
              );
            } else if (src.startsWith('youtube://')) {
              if (preferences.youtubeConsent) {
                return (
                  <View style={{ flex: 1 }}>
                    <YouTube
                      apiKey={config.google.youtubeKey}
                      videoId={src.substring(10)}
                      style={{ alignSelf: 'stretch', height: 300 }}
                    />
                  </View>
                );
              } else {
                return (
                  <Card style={{ flex: 1, minHeight: 200 }}>
                    <View style={[styles.container, { alignItems: 'center' }]}>
                      <Icon name="youtube" size={40} color={colors.disabled} />
                      <Title>GDPR - Youtube</Title>
                      <Text>
                        Si vous choississez d'activer les vidéos Youtube, Google pourra avoir accès
                        à certaines informations sur votre téléphone conformément à leur politique
                        de vie privée.
                      </Text>
                      <Button
                        mode="outlined"
                        onPress={() => updatePrefs({ youtubeConsent: true })}
                        style={{ marginTop: 20 }}
                      >
                        Autoriser
                      </Button>
                    </View>
                  </Card>
                );
              }
            } else {
              return <Text>[CONTENU NON VALIDE]</Text>;
            }
          },
        }}
        onLinkPress={(url: string) => {
          handleUrl(url);
          return false; // Indicates that we are handling the link ourselves
        }}
      >
        {data}
      </Markdown>
    );
  }
  if (parser === 'plaintext') {
    return (
      <Text style={{ fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }}>
        {data}
      </Text>
    );
  }
  return null;
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return {
    preferences,
  };
};

export default connect(mapStateToProps)(Content);
