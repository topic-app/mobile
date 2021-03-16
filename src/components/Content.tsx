import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { ImageStyle, View, Dimensions, Platform, Linking } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { Text, Card, Title, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import config from '@constants/config';
import updatePrefs from '@redux/actions/data/prefs';
import getStyles from '@styles/Styles';
import { Content as ContentType, State, Preferences } from '@ts/types';
import { useTheme, getImageUrl, handleUrl } from '@utils';
import AutoHeightImage from '@utils/autoHeightImage';
import { NativeStackNavigationProp } from '@utils/stack';
import YouTube from '@utils/youtube';

import { PlatformTouchable } from './PlatformComponents';

type Props = ContentType & { preferences: Preferences; trustLinks?: boolean };

const Content: React.FC<Props> = ({ parser, data, preferences, trustLinks = false }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => setLoaded(true), [null]);

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
                      navigation.push('Root', {
                        screen: 'Main',
                        params: {
                          screen: 'Display',
                          params: {
                            screen: 'Image',
                            params: {
                              screen: 'Display',
                              params: { image: src.substring(6) },
                            },
                          },
                        },
                      })
                    }
                  >
                    <AutoHeightImage
                      style={imageStyles._VIEW_SAFE_image}
                      source={{ uri: getImageUrl({ image: src.substring(6), size: 'full' }) || '' }}
                      width={Dimensions.get('window').width - 50}
                    />
                  </PlatformTouchable>
                </View>
              );
            } else if (src.startsWith('youtube://')) {
              if (Platform.OS === 'web') {
                if (!loaded) return null;
                return (
                  <iframe
                    src={`https://www.youtube.com/embed/${src.substring(10)}`}
                    title="youtube"
                    style={{ width: '100%', height: 480 }}
                  />
                );
              } else if (!config.google.youtubeKey) {
                return null;
              } else {
                return (
                  <View style={{ flex: 1 }}>
                    <YouTube
                      // apiKey is an Android-specific prop but does not
                      // appear in prop types but is required
                      // @ts-expect-error
                      apiKey={config.google.youtubeKey}
                      videoId={src.substring(10)}
                      style={{ alignSelf: 'stretch', height: 300 }}
                    />
                  </View>
                );
              }
            } else {
              return <Text>[CONTENU NON VALIDE]</Text>;
            }
          },
          textgroup: (node, children, parent, textStyles) => (
            <Text
              selectable
              key={node.key}
              style={[
                textStyles.textgroup,
                { textAlign: Platform.OS === 'android' ? 'left' : 'justify' },
              ]}
            >
              {children}
            </Text>
          ),
        }}
        onLinkPress={(url: string) => {
          handleUrl(url, { trusted: trustLinks });
          return false; // Indicates that we are handling the link ourselves
        }}
      >
        {data}
      </Markdown>
    );
  }
  if (parser === 'plaintext') {
    return (
      <Text
        selectable
        style={{ fontSize: preferences.fontSize, fontFamily: preferences.fontFamily }}
      >
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
