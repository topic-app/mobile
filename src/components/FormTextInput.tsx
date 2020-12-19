import React, { forwardRef } from 'react';
import { View, TextInput as NativeTextInput } from 'react-native';
import { HelperText, TextInput as PaperTextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '@utils/index';

type Props = Omit<Omit<React.ComponentProps<typeof PaperTextInput>, 'error'>, 'render'> & {
  error?: string;
  info?: string;
  touched?: boolean;
};

const FormTextInput = forwardRef<NativeTextInput, Props>((props, ref) => {
  const {
    error: errorString,
    touched,
    mode = 'outlined',
    info: infoString,
    disableFullscreenUI = true,
    ...rest
  } = props;
  const { colors } = useTheme();

  const valid = !errorString && touched;
  const error = !!(errorString && touched);

  const shouldShowIcon = valid || error;
  return (
    <View>
      <View>
        <PaperTextInput
          ref={ref}
          error={error}
          mode={mode}
          disableFullscreenUI={disableFullscreenUI}
          render={
            shouldShowIcon
              ? // add 30 px margin to inner TextInput
                ({ style, ...otherProps }) => (
                  <NativeTextInput style={[style, { marginRight: 30 }]} {...otherProps} />
                )
              : undefined
          }
          {...rest}
        />
        <View
          style={{
            position: 'absolute',
            right: 10,
            paddingTop: 3,
            height: '100%',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          {shouldShowIcon ? (
            <Icon
              name={valid ? 'check-circle-outline' : 'close-circle-outline'}
              size={27}
              color={valid ? colors.valid : colors.error}
            />
          ) : null}
        </View>
      </View>
      <HelperText type={error ? 'error' : 'info'} visible={error || !!infoString}>
        {error ? errorString : infoString}
      </HelperText>
    </View>
  );
});

export default FormTextInput;
