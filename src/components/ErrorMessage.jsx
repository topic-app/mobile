import React from 'react';
import { Linking } from 'react-native';
import { Banner, Avatar, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

function ErrorMessage({ type, contentType, error, retry, restart }) {
  const theme = useTheme();
  const { colors } = theme;

  let message = {
    icon: 'alert-decagram-outline',
    text: 'Erreur inconnue',
  };
  const actions = [
    {
      label: 'Signaler un bug',
      onPress: () => Linking.openURL('https://gitlab.com/topicapp/issues/issues'),
    },
  ];
  if (retry) {
    actions.push({
      label: 'Réessayer',
      onPress: retry,
    });
  }
  if (restart) {
    actions.push({
      label: 'Recommencer',
      onPress: restart,
    });
  }

  if (type === 'axios') {
    message = {
      icon: 'wifi-strength-off-outline',
      text: `Erreur lors de la récupération des ${contentType}. Veuillez vérifier votre connexion internet ou réessayer plus tard.`,
    };
  }

  return (
    <Banner
      visible
      actions={actions}
      icon={({ size }) => (
        <Avatar.Icon style={{ backgroundColor: colors.invalid }} size={size} icon={message.icon} />
      )}
    >
      {message.text}
    </Banner>
  );
}

ErrorMessage.defaultProps = {
  retry: null,
  restart: null,
  error: { unknown: true },
  contentType: 'données',
};

ErrorMessage.propTypes = {
  type: PropTypes.string.isRequired,
  contentType: PropTypes.string,
  error: PropTypes.oneOf(PropTypes.shape(), PropTypes.arrayOf(), null),
  retry: PropTypes.func,
  restart: PropTypes.func,
};

export default ErrorMessage;
