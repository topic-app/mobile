import { Alert, BackHandler } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import Store from '@redux/store';
import { request } from '@utils/index';

const errorHandler = async (error: any, isFatal: boolean) => {
  let stringifiedError: any = error;
  let errorError = false;
  if (typeof error === 'object') {
    try {
      stringifiedError = error.toString();
    } catch (error2) {
      try {
        stringifiedError = JSON.stringify(error);
      } catch (error3) {
        errorError = true;
      }
    }
  }

  const now = new Date();

  const errorString = `
\`\`\`yaml
Rapport de bug Topic
---
ERREUR
Type: CRASH ${isFatal ? 'FATAL' : 'NON FATAL'}
Nom: ${error?.name}
Message: ${error?.message}
Erreur: ${stringifiedError}
Recup. erreur: ${errorError}
Heure: ${now.toLocaleString()}
---
APPLICATION
Version: ${DeviceInfo.getVersion()}
Numero: ${DeviceInfo.getBuildNumber()}
---
DONNEES
Connecte: ${Store?.getState()?.account?.loggedIn}
ID compte: ${Store?.getState()?.account?.accountInfo?.accountId}
Location select.: ${Store?.getState()?.location?.selected}
Location: Écoles ${Store?.getState()?.location?.schools} | Départements ${
    Store?.getState()?.location?.departments
  } | Global ${Store?.getState()?.location?.global}
---
SYSTEME
Os: ${await DeviceInfo.getBaseOs()} | ${DeviceInfo.getSystemName()}
Version: ${DeviceInfo.getSystemVersion()} | Api ${await DeviceInfo.getApiLevel()}
Modele: Id ${DeviceInfo.getDeviceId()} | Model ${DeviceInfo.getModel()} | Vendor ${DeviceInfo.getBrand()} | Product ${await DeviceInfo.getDevice()}
---
Gen ErrorHandler
\`\`\`  `;

  const strippedErrorString = `
\`\`\`yaml
Rapport de bug Topic (version sans données personnelles)
---
ERREUR
Type: CRASH ${isFatal ? 'FATAL' : 'NON FATAL'}
Nom: ${error?.name}
Message: ${error?.message}
Recup. erreur: ${errorError}
Heure: ${now.toLocaleString()}
---
APPLICATION
Version: ${DeviceInfo.getVersion()}
Numero: ${DeviceInfo.getBuildNumber()}
---
DONNEES
Connecte: ${Store?.getState()?.account?.loggedIn}
Location select.: ${Store?.getState()?.location?.selected}
---
SYSTEME
Os: ${await DeviceInfo.getBaseOs()} | ${DeviceInfo.getSystemName()}
Version: ${DeviceInfo.getSystemVersion()} | Api ${await DeviceInfo.getApiLevel()}
Modele: Id ${DeviceInfo.getDeviceId()} | Model ${DeviceInfo.getModel()} | Vendor ${DeviceInfo.getBrand()} | Product ${await DeviceInfo.getDevice()}
---
Gen ErrorHandler
\`\`\`  `;

  Alert.alert(
    'Rapport de plantage',
    `
L'application Topic a eu un problème. Un rapport d'erreur a été créé (erreur ${error?.name})
Le rapport généré peut contenir des données sensibles, telles que votre mot de passe, votre adresse email, l'historique, etc.
Vous pouvez aussi choisir d'envoyer une version qui ne contient pas de données personnelles (mais qui est moins utile pour les développeurs).
${
  isFatal
    ? "L'application doit être redémarrée pour continuer."
    : "L'application n'a pas besoin de redémarrer."
}
`,
    [
      {
        text: 'Fermer',
        onPress: () => {
          if (isFatal) {
            BackHandler.exitApp();
          }
        },
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
                  title: `Rapport stripped CRASH ${DeviceInfo.getVersion()}`,
                  text: strippedErrorString,
                },
              ],
            },
            false,
          )
            .then(() => {
              if (isFatal) {
                BackHandler.exitApp();
              }
            })
            .catch(() => () => {
              if (isFatal) {
                BackHandler.exitApp();
              }
            }),
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
                  title: `Rapport complet CRASH ${DeviceInfo.getVersion()}`,
                  text: errorString,
                },
              ],
            },
            false,
          )
            .then(() => {
              if (isFatal) {
                BackHandler.exitApp();
              }
            })
            .catch(() => () => {
              if (isFatal) {
                BackHandler.exitApp();
              }
            }),
      },
    ],
    { cancelable: true },
  );
};

export default errorHandler;
