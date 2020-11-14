import React from 'react';
import { ImageStyle } from 'react-native';
import { Text } from 'react-native-paper';
import FitImage from 'react-native-fit-image';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import { connect } from 'react-redux';

import { Content as ContentType, State, Preferences } from '@ts/types';
import { useTheme, getImageUrl, handleUrl } from '@utils/index';
import getStyles from '@styles/Styles';

type Props = ContentType & { preferences: Preferences };

const Content: React.FC<Props> = ({ parser, data, preferences }) => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

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

            return (
              <FitImage
                indicator
                key={node.key}
                style={imageStyles._VIEW_SAFE_image}
                source={{ uri: getImageUrl({ image: src, size: 'medium' }) }}
              />
            );
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
