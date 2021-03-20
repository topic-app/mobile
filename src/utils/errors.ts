import { fetch as fetchNetInfo } from '@react-native-community/netinfo';
import { Clipboard } from 'react-native';

import Store from '@redux/store';
import { Error as ErrorType } from '@ts/types';

import Alert from './alert';
import { trackEvent } from './plausible';

type errorProps = {
  type: 'axios' | 'app' | 'other';
  error: any;
  retry?: () => any | null;
  back?: () => any | null;
  restart?: () => any | null;
  extra?: any;
  strings?: {
    action?: string;
    contentSingular?: string;
    contentPlural?: string;
  };
};
type popupProps = errorProps & { what: string };

const processError = async ({ type, error, retry, back, restart, strings, extra }: errorProps) => {
  const err = (Array.isArray(error) && error?.length > 0
    ? error.find((e) => !!e) || error[0]
    : error) as ErrorType;
  const netInfo = await fetchNetInfo();

  let message: { icon: string; text: string; code: string } = {
    icon: 'alert-decagram-outline',
    text: 'Erreur inconnue',
    code: 'unknown',
  };
  let actions: { text: string; onPress: () => void }[] = [];

  /* Category 1: api request error */
  if (type === 'axios') {
    if (err?.error?.response?.status === 503) {
      message = {
        icon: 'hammer-wrench',
        text: 'Le serveur est en maintenance. Merci de réessayer plus tard.',
        code: 'server-maintenance',
      };
      if (retry) {
        actions = [
          {
            text: 'Réessayer',
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
        text: 'Notre serveur a eu un problème. Merci de signaler ce bug ou de réessayer plus tard.',
        code: 'server-error',
      };
      if (retry) {
        actions.push({
          text: 'Réessayer',
          onPress: retry,
        });
      }
      // Type 1b: application sends malformed data
    } else if (err?.error?.response?.status === 422) {
      message = {
        icon: 'alert-decagram-outline',
        text: "L'application a envoyé des données malformées au serveur. Merci de signaler ce bug.",
        code: 'malformed-data',
      };
      if (back) {
        actions.push({
          text: 'Retour',
          onPress: back,
        });
      }
      // Type 2: Server returns bad request 400
    } else if (err?.error?.response?.status === 400) {
      message = {
        icon: 'file-alert-outline',
        text: "L'application a envoyé des données invalides au serveur. Merci de signaler ce bug.",
        code: 'invalid-data',
      };
      if (restart) {
        actions.push({
          text: 'Recommencer',
          onPress: restart,
        });
      }
      // Type 3a: Not found
    } else if (err?.error?.response?.status === 404) {
      message = {
        icon: 'file-alert-outline',
        text: `${
          strings?.contentSingular || "L'élément"
        } n'a pas été trouvé. Il n'existe pas ou n'a pas encore été publié.`,
        code: 'notfound',
      };
      if (retry) {
        actions.push({
          text: 'Réessayer',
          onPress: retry,
        });
      }
      if (back) {
        actions.push({
          text: 'Retour',
          onPress: back,
        });
      }
      // Type 3b: Deleted
    } else if (err?.error?.response?.status === 410) {
      message = {
        icon: 'delete-outline',
        text: `${strings?.contentSingular || "L'élément"} a été supprimé.`,
        code: 'deleted',
      };
      if (back) {
        actions.push({
          text: 'Retour',
          onPress: back,
        });
      }
      // Type 3c: Not verified
    } else if (err?.error?.response?.status === 451) {
      message = {
        icon: 'shield-alert-outline',
        text: `${strings?.contentSingular || "L'élément"} est en attente de modération.`,
        code: 'notvalidated',
      };
      if (retry) {
        actions.push({
          text: 'Réessayer',
          onPress: retry,
        });
      }
      if (back) {
        actions.push({
          text: 'Retour',
          onPress: back,
        });
      }
      // Type 4a: Server returns authentification needed 403 with wrong token
    } else if (err?.error?.response?.status === 403) {
      if (err?.error?.response?.data?.error?.value === 'token') {
        message = {
          icon: 'account-alert-outline',
          text:
            "Cette action nécessite un compte, mais il semblerait que vous ne soyez pas connecté ou qu'il y a un problème avec votre compte.",
          code: 'account-notloggedin',
        };
        if (back) {
          actions.push({
            text: 'Retour',
            onPress: back,
          });
        }
        // Type 4b: Token has expired
      } else if (err?.error?.response?.data?.error?.value === 'expired') {
        message = {
          icon: 'account-alert-outline',
          text: 'La connexion à votre compte a expiré, merci de vous reconnecter.',
          code: 'account-tokenexpired',
        };
        if (back) {
          actions.push({
            text: 'Retour',
            onPress: back,
          });
        }
        // Type 4c: user doesnt have permission
      } else if (err?.error?.response?.data?.error?.value === 'permission') {
        message = {
          icon: 'lock-alert',
          text:
            "Vous n'êtes pas autorisé à faire cette action, merci de vérifier que vous avez bien la permission.",
          code: 'account-nopermission',
        };
        if (back) {
          actions.push({
            text: 'Retour',
            onPress: back,
          });
        }
        // Type 4d: Action already done
      } else if (err?.error?.response?.data?.error?.value === 'already') {
        message = {
          icon: 'lock-alert',
          text:
            "Cette action ne peut être faite qu'une seule fois, et il semblerait que vous l'ayez déjà fait.",
          code: 'already',
        };
        if (back) {
          actions.push({
            text: 'Retour',
            onPress: back,
          });
        }
        // Type 4e: User is not author
      } else if (err?.error?.response?.data?.error?.value === 'author') {
        message = {
          icon: 'reload-alert',
          text:
            "Seul l'auteur peut faire cette action, et il semblerait que vous n'êtes pas l&apos;auteur.",
          code: 'account-notauthor',
        };
        if (back) {
          actions.push({
            text: 'Retour',
            onPress: back,
          });
        }
        // Type 4f: User has created too many
      } else if (err?.error?.response?.data?.error?.value === 'maximum') {
        message = {
          icon: 'reload',
          text:
            "Vous avez déjà créé trop d'éléments de ce type, merci d'en supprimer ou d'attendre la fermeture/suppression.",
          code: 'limit-content',
        };
        if (back) {
          actions.push({
            text: 'Retour',
            onPress: back,
          });
        }
        // Type 4z: Unknown
      } else {
        message = {
          icon: 'account-alert-outline',
          text:
            "Vous n'avez pas la permission de faire cette action ou vous n'êtes pas connecté. Si vous pensez avoir cette permission, merci de signaler un bug.",
          code: 'account-unknown',
        };
        if (back) {
          actions.push({
            text: 'Retour',
            onPress: back,
          });
        }
      }
      // Type 5: Rate limited
    } else if (err?.error?.response?.status === 429) {
      message = {
        icon: 'clock-alert-outline',
        text:
          'Votre appareil a été temporairement bloqué à cause d&apos;un nombre trop grand de requêtes.',
        code: 'limit-ratelimited',
      };
      if (back) {
        actions.push({
          text: 'Retour',
          onPress: back,
        });
      }
      if (retry) {
        actions.push({
          text: 'Réessayer',
          onPress: retry,
        });
      }
      // Type 6: Unknown 4xx error
    } else if (Math.floor((err?.error?.response?.status / 100) % 10) === 4) {
      message = {
        icon: 'alert-decagram-outline',
        text: "Erreur de serveur lors de l'action. Merci de signaler ce bug",
        code: 'server-unknown4xx',
      };
      if (back) {
        actions.push({
          text: 'Retour',
          onPress: back,
        });
      }
      if (retry) {
        actions.push({
          text: 'Réessayer',
          onPress: retry,
        });
      }
      // Type 7: No internet
    } else if (!netInfo.isConnected || !netInfo.isInternetReachable) {
      message = {
        icon: 'wifi-strength-off-outline',
        text: "Vous n'êtes pas connecté à Internet.",
        code: 'nointernet',
      };
      if (retry) {
        actions = [
          {
            text: 'Réessayer',
            onPress: retry,
          },
        ];
      }
      // Type 7: Some other network error or server completely down
    } else {
      message = {
        icon: 'wifi-strength-alert-outline',
        text: 'Veuillez vérifier votre connexion internet ou réessayer plus tard.',
        code: 'unknown',
      };
      if (retry) {
        actions.push({
          text: 'Réessayer',
          onPress: retry,
        });
      }
    }
    /* Category 2 : Other */
  } else {
    message = {
      icon: 'alert-decagram-outline',
      text: 'Une erreur inconnue est survenue.',
      code: 'unknown-notaxios',
    };
    if (back) {
      actions.push({
        text: 'Retour',
        onPress: back,
      });
    }
    if (retry) {
      actions.push({
        text: 'Réessayer',
        onPress: retry,
      });
      if (restart) {
        actions.push({
          text: 'Recommencer',
          onPress: restart,
        });
      }
    }
  }

  let stringifiedErr;
  try {
    stringifiedErr = JSON.stringify(err, null, 2);
  } catch (err) {
    stringifiedErr = `Could not stringify`;
  }
  const details = JSON.stringify(
    {
      status: err?.error?.response?.status,
      code: message.code,
      extra,
      error: stringifiedErr,
    },
    null,
    2,
  );

  return { message, actions, status: err?.error?.response?.status, details };
};

const showPopup = async ({ what, type, error, retry, back, restart }: popupProps) => {
  const { message, actions, status, details } = await processError({
    type,
    error,
    retry,
    back,
    restart,
    extra: {
      type: 'popup',
      what,
    },
  });
  trackEvent('error', {
    props: { type: 'popup', what, error: message.code, status: (status || 0).toString() },
  });
  Alert.alert(
    `Une erreur est survenue lors de ${what}`,
    `${message.text} (${error?.error?.toString()})`,
    [
      { text: 'Fermer' },
      ...actions,
      ...(Store.getState().preferences.advancedMode
        ? [{ text: 'Copier', onPress: () => Clipboard.setString(details) }]
        : []),
    ],
  );
};

export { showPopup, processError };
