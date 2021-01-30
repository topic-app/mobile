import React from 'react';
import { Banner, Avatar } from 'react-native-paper';

import { Error as ErrorType, RequestState } from '@ts/types';
import { processError } from '@utils/errors';
import { useTheme, trackEvent } from '@utils/index';

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
  const err = (Array.isArray(error) && error?.length > 0
    ? error.find((e) => !!e) || error[0]
    : error) as ErrorType;
  const theme = useTheme();
  const { colors } = theme;

  const [errorInfo, setErrorInfo] = React.useState<{
    message: { icon: string; text: string; code: string };
    actions: { text: string; onPress: () => void }[];
    status: number;
  } | null>(null);

  React.useEffect(() => {
    const init = async () => {
      const { message, actions, status } = await processError({
        type,
        error,
        retry,
        back,
        restart,
      });
      setErrorInfo({ message, actions, status });
      trackEvent('error', {
        props: {
          type: 'banner',
          what: strings.what,
          error: message.code,
          status: (status || 0).toString(),
        },
      });
    };
    init();
  }, []);

  if (!errorInfo) return null;

  return (
    <Banner
      visible
      actions={errorInfo.actions.map((a) => {
        return { label: a.text, onPress: a.onPress };
      })}
      icon={({ size }) => (
        <Avatar.Icon
          style={{ backgroundColor: colors.invalid }}
          size={size}
          icon={errorInfo.message.icon}
        />
      )}
    >
      {`${errorInfo.message.text} (${
        Array.isArray(error) && error.length > 0
          ? error
              .map((e) => e?.error?.toString())
              .filter((s) => !!s)
              .join(', ')
          : err?.error?.toString()
      })`}
    </Banner>
  );
};

export default ErrorMessage;
