import React from 'react';
import { Linking } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { Banner, Avatar, useTheme } from 'react-native-paper';
import PropTypes from 'prop-types';

function ErrorMessage({ type, strings, error, retry, restart, back }) {
  const err = Array.isArray(error) && error?.length > 0 ? error[0] : error;
  const theme = useTheme();
  const netInfo = useNetInfo();
  const { colors } = theme;

  let message = {
    icon: 'alert-decagram-outline',
    text: 'Erreur inconnue',
  };
  let actions = [
    {
      label: 'Signaler un bug',
      onPress: () => Linking.openURL('https://gitlab.com/topicapp/issues/issues'),
    },
  ];

  /* Category 1: api request error */
  if (type === 'axios') {
    if (err?.error?.response?.status === 503) {
      message = {
        icon: 'hammer-wrench',
        text: `Le serveur est en maintenance. Merci de réessayer plus tard`,
      };
      if (retry) {
        actions = [
          {
            label: 'Réessayer',
            onPress: retry,
          },
        ];
      }
      // Type 1: Server returns success: false with a 200 status code, or returns 500 error of any kind
    } else if (
      err?.reason === 'success' ||
      Math.floor((err?.error?.response?.status / 100) % 10) === 5
    ) {
      message = {
        icon: 'alert-decagram-outline',
        text: `Notre serveur a eu un problème lors de ${strings.what}. Merci de signaler ce bug ou de réessayer plus tard`,
      };
      if (retry) {
        actions.push({
          label: 'Réessayer',
          onPress: retry,
        });
      }
      // Type 1b: application sends malformed data
    } else if (err?.error?.response?.status === 422) {
      message = {
        icon: 'alert-decagram-outline',
        text: 'L&application a envoyé des données malformées au serveur. Merci de signaler ce bug.',
      };
      if (back) {
        actions.push({
          label: 'Retour',
          onPress: back,
        });
      }
      // Type 2: Server returns bad request 400
    } else if (err?.error?.response?.status === 400) {
      message = {
        icon: 'file-alert-outline',
        text:
          'Il semble y avoir un problème avec les données envoyées. Merci de vérifier que les informations sont correctes, ou de signaler un bug si c&apos;est le cas',
      };
      if (restart) {
        actions.push({
          label: 'Recommencer',
          onPress: restart,
        });
      }
      // Type 3a: Not found
    } else if (err?.error?.response?.status === 404) {
      message = {
        icon: 'file-alert-outline',
        text: `${strings.contentSingular} n'a pas été trouvé. Il n'existe pas ou n'a pas encore été publié`,
      };
      if (back) {
        actions.push({
          label: 'Retour',
          onPress: back,
        });
      }
      // Type 3b: Deleted
    } else if (err?.error?.response?.status === 410) {
      message = {
        icon: 'delete-outline',
        text: `${strings.contentSingular} a été supprimé`,
      };
      if (back) {
        actions.push({
          label: 'Retour',
          onPress: back,
        });
      }
      // Type 3c: Not verified
    } else if (err?.error?.response?.status === 451) {
      message = {
        icon: 'shield-alert-outline',
        text: `${strings.contentSingular} est en attente de modération `,
      };
      if (retry) {
        actions.push({
          label: 'Réessayer',
          onPress: retry,
        });
      }
      if (back) {
        actions.push({
          label: 'Retour',
          onPress: back,
        });
      }
      // Type 4a: Server returns authentification needed 403 with wrong token
    } else if (err?.error?.response?.status === 403) {
      if (err?.error?.response?.data?.error?.value === 'token') {
        message = {
          icon: 'account-alert-outline',
          text:
            'Cette action nécéssite un compte, mais il semblerait que vous ne soyez pas connectés ou qu&apos;il y a un problème avec votre compte',
        };
        if (back) {
          actions.push({
            label: 'Retour',
            onPress: back,
          });
        }
        // Type 4b: Token has expired
      } else if (err?.error?.response?.data?.error?.value === 'expired') {
        message = {
          icon: 'account-alert-outline',
          text: 'La connexion à votre compte a expiré, merci de vous reconnecter',
        };
        if (back) {
          actions.push({
            label: 'Retour',
            onPress: back,
          });
        }
        // Type 4c: user doesnt have permission
      } else if (err?.error?.response?.data?.error?.value === 'permission') {
        message = {
          icon: 'lock-alert',
          text:
            'Vous n&apos;êtes pas autorisés à faire cette action, merci de vérifier que vous avez bien la permission.',
        };
        if (back) {
          actions.push({
            label: 'Retour',
            onPress: back,
          });
        }
        // Type 4d: Action already done
      } else if (err?.error?.response?.data?.error?.value === 'already') {
        message = {
          icon: 'lock-alert',
          text:
            'Cette action ne peut être faite qu&apos;une seule fois, et il semblerait que vous l&apos;ayez déjà fait',
        };
        if (back) {
          actions.push({
            label: 'Retour',
            onPress: back,
          });
        }
        // Type 4e: User is not author
      } else if (err?.error?.response?.data?.error?.value === 'author') {
        message = {
          icon: 'reload-alert',
          text:
            'Seul l&apos;auteur peut faire cette action, et il semblerait que vous n&apos;êtes pas l&auteur',
        };
        if (back) {
          actions.push({
            label: 'Retour',
            onPress: back,
          });
        }
        // Type 4f: User has created too many
      } else if (err?.error?.response?.data?.error?.value === 'maximum') {
        message = {
          icon: 'reload-alert',
          text: `Vous avez déjà créée trop ${strings.contentPlural}, merci d'en supprimer ou d'attendre la fermeture/suppression.`,
        };
        if (back) {
          actions.push({
            label: 'Retour',
            onPress: back,
          });
        }
        // Type 4z: Unknown
      } else {
        message = {
          icon: 'account-alert-outline',
          text:
            'Vous n&apos;avez pas la permission de faire cette action, ou vous n&apos;etes pas connectés. Si vous pensez avoir cette permission, merci de signaler un bug',
        };
        if (back) {
          actions.push({
            label: 'Retour',
            onPress: back,
          });
        }
      }
      // Type 5: Rate limited
    } else if (err?.error?.response?.status === 429) {
      message = {
        icon: 'clock-alert-outline',
        text:
          'Votre appareil a été temporairement bloqué à cause d&un nombre trop grand de requêtes',
      };
      if (back) {
        actions.push({
          label: 'Retour',
          onPress: back,
        });
      }
      if (retry) {
        actions.push({
          label: 'Réessayer',
          onPress: retry,
        });
      }
      // Type 6: Unknown 4xx error
    } else if (Math.floor((err?.error?.response?.status / 100) % 10) === 4) {
      message = {
        icon: 'alert-decagram-outline',
        text: `Erreur de serveur lors de ${strings.what}. Merci de signaler ce bug`,
      };
      if (back) {
        actions.push({
          label: 'Retour',
          onPress: back,
        });
      }
      if (retry) {
        actions.push({
          label: 'Réessayer',
          onPress: retry,
        });
      }
      // Type 7: No internet
    } else if (!netInfo.isConnected || !netInfo.isInternetReachable) {
      message = {
        icon: 'wifi-strength-off-outline',
        text: `Vous n'êtes pas connectés à Internet`,
      };
      if (retry) {
        actions = [
          {
            label: 'Réessayer',
            onPress: retry,
          },
        ];
      }
      // Type 7: Some other network error or server completely down
    } else {
      message = {
        icon: 'wifi-strength-alert-outline',
        text: `Erreur lors de ${strings.what}. Veuillez vérifier votre connexion internet ou réessayer plus tard.`,
      };
      if (retry) {
        actions.push({
          label: 'Réessayer',
          onPress: retry,
        });
      }
    }
    /* Category 2 : Other */
  } else {
    message = {
      icon: 'alert-decagram-outline',
      text: `Une erreur inconnue est survenue`,
    };
    if (back) {
      actions.push({
        label: 'Retour',
        onPress: back,
      });
    }
    if (retry) {
      actions.push({
        label: 'Réessayer',
        onPress: retry,
      });
      if (restart) {
        actions.push({
          label: 'Recommencer',
          onPress: restart,
        });
      }
    }
  }

  return (
    <Banner
      visible
      actions={actions}
      icon={({ size }) => (
        <Avatar.Icon style={{ backgroundColor: colors.invalid }} size={size} icon={message.icon} />
      )}
    >
      {message.text} (
      {Array.isArray(error) && error.length > 0
        ? error.map((e) => e?.error?.toString()).join(', ')
        : err?.error?.toString()}
      )
    </Banner>
  );
}

ErrorMessage.defaultProps = {
  retry: null,
  restart: null,
  back: null,
  error: { unknown: true },
  strings: {
    what: 'la récupération des données',
    extra: '',
    contentPlural: 'de contenus de ce type',
    contentSingular: 'Le contenu',
  },
};

ErrorMessage.propTypes = {
  type: PropTypes.string.isRequired,
  strings: PropTypes.shape({
    what: PropTypes.string,
    extra: PropTypes.string,
    contentPlural: PropTypes.string,
    contentSingular: PropTypes.string,
  }),
  error: PropTypes.oneOf([PropTypes.object, PropTypes.array, null]), // TODO: Better PropTypes
  retry: PropTypes.func,
  restart: PropTypes.func,
  back: PropTypes.func,
};

export default ErrorMessage;
