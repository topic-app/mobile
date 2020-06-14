import React from 'react';
import { Text, withTheme } from 'react-native-paper';
import PropTypes from 'prop-types';
import Markdown from 'react-native-markdown-display';
import MarkdownIt from 'markdown-it';
import FitImage from 'react-native-fit-image';
import { config } from '@root/app.json';
import handleUrl from '@utils/handleUrl';

import getStyles from '@styles/Styles';
import { getImageUrl } from '../utils/getAssetUrl';

function Content({ parser, data, theme }) {
  const styles = getStyles(theme);
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
        onLinkPress={handleUrl}
      >
        {data}
      </Markdown>
    );
  }
  if (parser === 'plaintext') {
    return <Text>{data}</Text>;
  }
  return null;
}

Content.propTypes = {
  parser: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      valid: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default withTheme(Content);
