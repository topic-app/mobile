import React from 'react';
import { Text, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import Markdown, { MarkdownIt } from 'react-native-markdown-display';
import FitImage from 'react-native-fit-image';

import { ContentParser } from '@ts/types';
import getStyles from '@styles/Styles';
import { getImageUrl, handleUrl } from '@utils/index';

type Props = {
  parser: ContentParser;
  data: string;
};

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
          image: (node, children, parent, imageStyles) => {
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

Content.propTypes = {
  parser: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};

export default Content;
