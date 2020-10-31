import React from 'react';
import { Searchbar as PaperSearchbar } from 'react-native-paper';
import { TextInput } from 'react-native';

import { logger } from '@utils/index';

type SearchbarProps = React.ComponentPropsWithoutRef<typeof PaperSearchbar> & {
  onIdle?: (value: string) => void;
  delay?: number;
};

class Searchbar extends React.Component<SearchbarProps> {
  private searchRef = React.createRef<TextInput>();

  private mounted = false;

  private lastTimeout?: NodeJS.Timeout;

  isWaiting = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private onInput = (value: string) => {
    const { onChangeText, onIdle, delay = 750 } = this.props;
    if (onChangeText) onChangeText(value);
    if (onIdle) {
      if (this.lastTimeout) {
        logger.verbose('Searchbar: Clearing previous timer & starting new timer', this.lastTimeout);
        clearTimeout(this.lastTimeout);
      }
      this.isWaiting = true;
      this.lastTimeout = setTimeout(() => {
        logger.verbose('Searchbar: Timer fired', this.lastTimeout);
        if (this.mounted) {
          this.isWaiting = false;
          onIdle(value);
        }
      }, delay);
    }
  };

  // Copy ref methods from react-native-paper's Searchbar
  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this.searchRef.current!.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this.searchRef.current!.clear();
  }

  /**
   * Focuses the input.
   */
  focus() {
    return this.searchRef.current!.focus();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this.searchRef.current!.blur();
  }

  render() {
    return <PaperSearchbar ref={this.searchRef} {...this.props} onChangeText={this.onInput} />;
  }
}

export default Searchbar;
