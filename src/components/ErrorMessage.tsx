import React from 'react';
import { Clipboard } from 'react-native';
import { useTheme, Banner, Avatar } from 'react-native-paper';
import { connect } from 'react-redux';

import { Error as ErrorType, RequestState, State } from '@ts/types';
import { trackEvent } from '@utils';
import { processError } from '@utils/errors';

export type ErrorMessageProps = {
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

const ErrorMessage: React.FC<ErrorMessageProps & { advancedMode: boolean }> = ({
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
  advancedMode,
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
    details: string;
  } | null>(null);

  React.useEffect(() => {
    const init = async () => {
      const { message, actions, status, details } = await processError({
        type,
        error,
        retry,
        back,
        restart,
        strings,
        extra: {
          type: 'banner',
          what: strings.what,
          advancedMode,
        },
      });
      setErrorInfo({ message, actions, status, details });
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

  const actions: { label: string; onPress: () => void }[] = errorInfo.actions.map((a) => ({
    label: a.text,
    onPress: a.onPress,
  }));

  if (advancedMode) {
    actions.push({ label: 'Copier', onPress: () => Clipboard.setString(errorInfo.details) });
  }

  return (
    <Banner
      visible
      actions={actions}
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

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { advancedMode: preferences.advancedMode };
};

export default connect(mapStateToProps)(ErrorMessage);
