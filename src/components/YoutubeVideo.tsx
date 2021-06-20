import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Platform, View, AppState, Text } from 'react-native';
import { Button } from 'react-native-paper';

import { handleUrl, logger } from '@utils';
import YouTube, { YoutubeIframeRef } from '@utils/compat/youtube';

type props = {
  videoId: string;
};

const YoutubeVideo: React.FC<props> = ({ videoId }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1 }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
          title="youtube"
          style={{ width: '100%', height: 480 }}
          allow="fullscreen"
        />
        <View style={{ flex: 1 }}>
          <Button
            onPress={() => handleUrl(`https://youtube.com/watch?v=${videoId}`)}
            mode="text"
            uppercase={false}
            icon="open-in-new"
          >
            Ouvrir sur Youtube
          </Button>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <YouTube
          videoId={videoId}
          key={videoId}
          webViewStyle={{ opacity: 0.99 }} // Hack because of webview bug, dont remove
          height={300}
          onError={(error) => logger.warn(`Error in youtube player (video ${videoId}): ${error}`)}
          initialPlayerParams={{
            modestbranding: true,
            rel: false,
          }}
        />
        <View style={{ flex: 1, marginTop: -40 }}>
          <Button
            onPress={() => handleUrl(`https://youtube.com/watch?v=${videoId}`)}
            mode="text"
            uppercase={false}
            icon="open-in-new"
          >
            Ouvrir sur Youtube
          </Button>
        </View>
      </View>
    );
  }
};

export default YoutubeVideo;
