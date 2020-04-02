import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import Markdown from 'react-native-markdown-display';
import MarkdownIt from 'react-native-markdown-display/src/MarkdownIt';

import { styles } from '../../styles/Styles';

function Content({ parser, data }) {
  if (parser === 'markdown') {
    return (<Markdown
      markdownit={
        MarkdownIt({html: false, breaks: true, linkify: true}).disable([ 'html_block', 'html_inline' ])
      }
      style={{
        body: styles.text,
      }}>
        {data}
      </Markdown>
    );
  }
  if (parser === 'plaintext') {
    return (<Text style={styles.text}>{data}</Text>);
  }
  return null;
}

Content.propTypes = {
  parser: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
}

export default Content;
