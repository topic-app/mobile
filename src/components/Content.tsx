import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { ImageStyle, View, Dimensions, Platform } from 'react-native';
import Autolink from 'react-native-autolink';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { Button, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';

import { Config } from '@constants';
import getStyles from '@styles/global';
import { Content as ContentType, State, Preferences } from '@ts/types';
import { getImageUrl, handleUrl, YouTube } from '@utils';
import { NativeStackNavigationProp } from '@utils/compat/stack';

import AutoHeightImage from './AutoHeightImage';
import { PlatformTouchable } from './PlatformComponents';
import YoutubeVideo from './YoutubeVideo';

type Props = ContentType & { preferences: Preferences; trustLinks?: boolean };

const Content: React.FC<Props> = ({ parser, data, preferences, trustLinks = false }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();

  if (parser === 'markdown') {
    const md = MarkdownIt({
      html: false,
      breaks: true,
      linkify: true,
    });
    md.disable(['html_block', 'html_inline']);
    md.linkify.set({ fuzzyLink: false, fuzzyIp: false, fuzzyEmail: false });

    return (
      <Markdown
        markdownit={md}
        style={{
          body: {
            ...styles.text,
            fontSize: preferences.fontSize,
            fontFamily: preferences.fontFamily !== 'system' ? preferences.fontFamily : undefined,
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
              return <YoutubeVideo videoId={src.substring(10)} />;
            } else {
              return <Text>[CONTENU NON VALIDE]</Text>;
            }
          },
          textgroup: ({ key }, children, parent, textStyles) => (
            <Text
              selectable
              key={key}
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
      <Autolink
        onPress={(url: string) => handleUrl(url, { trusted: trustLinks })}
        linkStyle={[styles.primaryText, { textDecorationLine: 'underline' }]}
        textProps={{
          selectable: true,
          style: {
            fontSize: preferences.fontSize,
            color: colors.text,
            fontFamily: preferences.fontFamily !== 'system' ? preferences.fontFamily : undefined,
          },
        }}
        url={{
          schemeMatches: true,
          wwwMatches: false,
          tldMatches: false,
        }}
        stripPrefix={false}
        stripTrailingSlash={false}
        truncate={0}
        text={data}
      />
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
