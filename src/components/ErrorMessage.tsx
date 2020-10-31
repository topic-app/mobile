import React from 'react';
import { Alert } from 'react-native';
import { Banner, Avatar } from 'react-native-paper';
import { useNetInfo } from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';

import { Error as ErrorType, RequestState } from '@ts/types';
import { useTheme, request } from '@utils/index';
import Store from '@redux/store';

type Props = {
  /* Please change me if 'app' is too vague! */
  type: 'axios' | 'app';
  strings: {
    what: string;
    contentSingular?: string;
    contentPlural?: string;
    extra?: string;
  };
  error?: RequestState['error'] | ErrorType | ErrorType[] | any;
  id?: string;
  retry?: () => any;
  restart?: () => any;
  back?: () => any;
};

const ErrorMessage: React.FC<Props> = ({
  type,
  strings = {
    what: 'la récupération des données',
    extra: '',
    contentPlural: 'de contenus de ce type',
    contentSingular: 'Le contenu',
  },
  id = 'Inconnu',
  error = { unknown: true },
  retry,
  restart,
  back,
}) => {
  const err = (Array.isArray(error) && error?.length > 0 ? error[0] : error) as ErrorType;
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
      onPress: async () => {
        let stringifiedError: any = error;
        let errorError = false;
        if (typeof error === 'object') {
          try {
            console.log(JSON.stringify(error));
            stringifiedError = JSON.stringify(error);
          } catch (error2) {
            try {
              stringifiedError = error.toString();
            } catch (error3) {
              errorError = true;
            }
          }
        }

        const state = Store?.getState() || { error: true };

        const responseData =
          err?.error?.response?.data?.error?.value || JSON.stringify(err?.error?.response?.data);

        const now = new Date();

        const errorString = `
\`\`\`yaml
Rapport de bug Topic
---
ERREUR
Type: ${type}
Localisation: ${id}
Description: ${strings?.what}
Code http: ${err?.error?.response?.status}
Data res: ${responseData}
Erreur: ${stringifiedError}
Recup. erreur: ${errorError}
Heure: ${now.toLocaleString()}
---
APPLICATION
Version: ${DeviceInfo.getVersion()}
Numéro: ${DeviceInfo.getBuildNumber()}
---
DONNEES
Connecte: ${state?.account?.loggedIn}
ID compte: ${state?.account?.accountInfo?.accountId}
Location select.: ${state?.location?.selected}
Location: Écoles ${state?.location?.schools} | Départements ${
          state?.location?.departments
        } | Global ${state?.location?.global}
StateError: ${state.error}
---
SYSTEME
Os: ${await DeviceInfo.getBaseOs()} | ${DeviceInfo.getSystemName()}
Version: ${DeviceInfo.getSystemVersion()} | Api ${await DeviceInfo.getApiLevel()}
Modele: Id ${DeviceInfo.getDeviceId()} | Model ${DeviceInfo.getModel()} | Vendor ${DeviceInfo.getBrand()} | Product ${await DeviceInfo.getDevice()}
---
Gen ErrorMessage
\`\`\`  `;

        const strippedErrorString = `
\`\`\`yaml
Rapport de bug Topic (version sans données personelles)
---
ERREUR
Type: ${type}
Localisation: ${id}
Description: ${strings?.what}
Code http: ${err?.error?.response?.status}
Heure: ${now.toLocaleString()}
---
APPLICATION
Version: ${DeviceInfo.getVersion()}
Numero: ${DeviceInfo.getBuildNumber()}
---
DONNEES
Connecte: ${state?.account?.loggedIn}
Location select.: ${state?.location?.selected}
---
SYSTEME
Os: ${await DeviceInfo.getBaseOs()} | ${DeviceInfo.getSystemName()}
Version: ${DeviceInfo.getSystemVersion()} | Api ${await DeviceInfo.getApiLevel()}
Modele: Id ${DeviceInfo.getDeviceId()} | Model ${DeviceInfo.getModel()} | Vendor ${DeviceInfo.getBrand()} | Product ${await DeviceInfo.getDevice()}
---
Gen ErrorMessage
\`\`\`  `;
        Alert.alert(
          'Signaler un bug',
          `
Le rapport généré peut contenir des données sensibles, telles que votre mot de passe, votre adresse email, l'historique etc.
Vous pouvez aussi choisir d'envoyer une version qui ne contient pas de données personnelles (mais qui est moins utile pour les développeurs)
`,
          [
            {
              text: 'Annuler',
            },
            {
              text: 'Envoyer (sans données sensibles)',
              onPress: () =>
                request(
                  'https://chat.topicapp.fr/hooks/8uo3fQRFFuTx5kXFi/sWCyfDXsJLyiBKq6LjFyvwv6dtn8bHjCEiKS7os5P7x97s9W',
                  'post',
                  {
                    attachments: [
                      {
                        title: `Rapport stripped ${err?.error?.response?.status}`,
                        text: strippedErrorString,
                      },
                    ],
                  },
                  false,
                ),
            },
            {
              text: 'Envoyer (avec données sensibles)',
              onPress: () =>
                request(
                  'https://chat.topicapp.fr/hooks/8uo3fQRFFuTx5kXFi/sWCyfDXsJLyiBKq6LjFyvwv6dtn8bHjCEiKS7os5P7x97s9W',
                  'post',
                  {
                    attachments: [
                      {
                        title: `Rapport complet ${err?.error?.response?.status}`,
                        text: errorString,
                      },
                    ],
                  },
                  false,
                ),
            },
          ],
          { cancelable: true },
        );
      },
    },
  ];

  /* Category 1: api request error */
  if (type === 'axios') {
    if (err?.error?.response?.status === 503) {
      message = {
        icon: 'hammer-wrench',
        text: 'Le serveur est en maintenance. Merci de réessayer plus tard',
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
        text:
          'L&apos;application a envoyé des données malformées au serveur. Merci de signaler ce bug.',
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
          "Il semble y avoir un problème avec les données envoyées. Merci de vérifier que les informations sont correctes, ou de signaler un bug si c'est le cas",
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
            "Cette action nécéssite un compte, mais il semblerait que vous ne soyez pas connectés ou qu'il y a un problème avec votre compte",
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
            "Vous n'êtes pas autorisés à faire cette action, merci de vérifier que vous avez bien la permission.",
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
            "Cette action ne peut être faite qu'une seule fois, et il semblerait que vous l'ayez déjà fait",
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
            "Seul l'auteur peut faire cette action, et il semblerait que vous n'êtes pas l&auteur",
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
            "Vous n'avez pas la permission de faire cette action, ou vous n'etes pas connectés. Si vous pensez avoir cette permission, merci de signaler un bug",
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
        text: "Vous n'êtes pas connectés à Internet",
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
      text: 'Une erreur inconnue est survenue',
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
};

export default ErrorMessage;
