import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import { ImageStyle } from 'react-native';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import FitImage from 'react-native-fit-image';

import { Content as ContentType } from '@ts/types';
import getStyles from '@styles/Styles';
import { getImageUrl, handleUrl } from '@utils/index';

type Props = ContentType;

const Content: React.FC<Props> = ({ parser, data }) => {
  const styles = getStyles(useTheme());
  if (parser === 'markdown') {
    return (
      <Markdown
        markdownit={MarkdownIt({ html: false, breaks: true, linkify: true }).disable([
          'html_block',
          'html_inline',
        ])}
        style={{
          body: styles.text,
          link: styles.primaryText,
        }}
        rules={{
          image: (node, children, parent, imageStyles: { [key: string]: ImageStyle }) => {
            const { src } = node.attributes;

            return (
              <FitImage
                indicator
                key={node.key}
                style={imageStyles._VIEW_SAFE_image}
                source={{ uri: getImageUrl(src, 'medium') }}
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
    return <Text>{data}</Text>;
  }
  return null;
};

export default Content;
