/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import React, { Component } from 'react';
import { FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { actions } from './const';
import { trackEvent } from '@utils';

export const defaultActions = [
  actions.insertImage,
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  actions.insertLink,
];

function getDefaultIcon() {
  return {};
}

export default class RichToolbar extends Component {
  // static propTypes = {
  //   getEditor?: PropTypes.func.isRequired,
  //   editor?: PropTypes.object,
  //   actions: PropTypes.array,
  //   onPressAddImage: PropTypes.func,
  //   onInsertLink: PropTypes.func,
  //   selectedButtonStyle: PropTypes.object,
  //   iconTint: PropTypes.any,
  //   selectedIconTint: PropTypes.any,
  //   unselectedButtonStyle: PropTypes.object,
  //   disabledButtonStyle: PropTypes.object,
  //   disabledIconTint: PropTypes.any,
  //   renderAction: PropTypes.func,
  //   iconMap: PropTypes.object,
  //   disabled: PropTypes.bool,
  // };

  static defaultProps = {
    actions: defaultActions,
    disabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      editor: void 0,
      selectedItems: [],
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    let that = this;
    return (
      nextProps.actions !== that.props.actions ||
      nextState.editor !== that.state.editor ||
      nextState.selectedItems !== that.state.selectedItems ||
      nextState.actions !== that.state.actions ||
      nextState.style !== that.props.style
    );
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { actions } = nextProps;
    if (actions !== prevState.actions) {
      let { selectedItems = [] } = prevState;
      return {
        actions,
        data: actions.map((action) => ({ action, selected: selectedItems.includes(action) })),
      };
    }
    return null;
  }

  componentDidMount() {
    const { editor: { current: editor } = { current: this.props?.getEditor() } } = this.props;
    if (!editor) {
      throw new Error('Toolbar has no editor!');
    } else {
      editor.registerToolbar((selectedItems) => this.setSelectedItems(selectedItems));
      this.setState({ editor });
    }
  }

  setSelectedItems(selectedItems) {
    if (selectedItems !== this.state.selectedItems) {
      this.setState({
        selectedItems,
        data: this.state.actions.map((action) => ({
          action,
          selected: selectedItems.includes(action),
        })),
      });
    }
  }

  _getButtonSelectedStyle() {
    return this.props.selectedButtonStyle && this.props.selectedButtonStyle;
  }

  _getButtonUnselectedStyle() {
    return this.props.unselectedButtonStyle && this.props.unselectedButtonStyle;
  }

  _getButtonDisabledStyle() {
    return this.props.disabledButtonStyle && this.props.disabledButtonStyle;
  }

  _getButtonIcon(action) {
    if (this.props.iconMap && this.props.iconMap[action]) {
      return this.props.iconMap[action];
    } else if (getDefaultIcon()[action]) {
      return getDefaultIcon()[action];
    } else {
      return undefined;
    }
  }

  _onPress(action) {
    trackEvent('editor:button', { props: { button: action}});
    const { onPressAddImage, onInsertLink } = this.props;
    switch (action) {
      case actions.insertLink:
        if (onInsertLink) return onInsertLink();
      case actions.setBold:
      case actions.setItalic:
      case actions.insertBulletsList:
      case actions.insertOrderedList:
      case actions.setUnderline:
      case actions.heading1:
      case actions.heading2:
      case actions.heading3:
      case actions.heading4:
      case actions.heading5:
      case actions.heading6:
      case actions.setParagraph:
      case actions.removeFormat:
      case actions.alignLeft:
      case actions.alignCenter:
      case actions.alignRight:
      case actions.alignFull:
      case actions.setSubscript:
      case actions.setSuperscript:
      case actions.setStrikethrough:
      case actions.setHR:
      case actions.setIndent:
      case actions.setOutdent:
        this.state.editor.showAndroidKeyboard();
        this.state.editor._sendAction(action, 'result');
        break;
      case actions.insertImage:
        onPressAddImage && onPressAddImage();
        break;
      default:
        this.props[action] && this.props[action]();
        break;
    }
  }

  _getAccessibilityLabel(action) {
    switch (action) {
      case actions.insertLink: return "Insérer un lien";
      case actions.setBold: return "Gras";
      case actions.setItalic: return "Italique";
      case actions.insertBulletsList: return "Insérer une liste non-ordonnée";
      case actions.insertOrderedList: return "Insérer une liste ordonnée";
    case actions.heading1: return 'Titre 1';
    case actions.heading2: return 'Titre 2';
    case actions.heading3: return 'Titre 3';
    case actions.heading4: return 'Titre 4';
    case actions.heading5: return 'Titre 5';
    case actions.heading6: return 'Titre 6';
    case actions.setParagraph: return 'Retirer le formattage';
    case actions.removeFormat: return 'Retirer le formattage';
    case actions.insertImage: return 'Insérer une image';
    case actions.insertYoutube: return 'Insérer une vidéo youtube';
    }
  }

  _defaultRenderAction(action, selected) {
    let that = this;
    const icon = that._getButtonIcon(action);
    const label = that._getAccessibilityLabel(action);
    const { iconSize = 50, disabled } = that.props;
    const style = selected ? that._getButtonSelectedStyle() : that._getButtonUnselectedStyle();
    const tintColor = disabled
      ? that.props.disabledIconTint
      : selected
      ? that.props.selectedIconTint
      : that.props.iconTint;
    return (
      <TouchableOpacity
        key={action}
        disabled={disabled}
        style={[{ width: iconSize, justifyContent: 'center' }, style]}
        onPress={() => that._onPress(action)}
        accessibilityLabel={label}
      >
        {icon ? (
          typeof icon === 'function' ? (
            icon({ selected, disabled, tintColor, iconSize })
          ) : (
            <Image
              source={icon}
              style={{
                tintColor: tintColor,
                height: iconSize,
                width: iconSize,
              }}
            />
          )
        ) : null}
      </TouchableOpacity>
    );
  }

  _renderAction(action, selected) {
    return this.props.renderAction
      ? this.props.renderAction(action, selected)
      : this._defaultRenderAction(action, selected);
  }

  render() {
    const { style, disabled } = this.props;
    const vStyle = [styles.barContainer, style, disabled && this._getButtonDisabledStyle()];
    return (
      <View style={vStyle}>
        <FlatList
          horizontal
          keyboardShouldPersistTaps={'always'}
          keyExtractor={(item, index) => item.action + '-' + index}
          data={this.state.data}
          alwaysBounceHorizontal={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => this._renderAction(item.action, item.selected)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  barContainer: {
    height: 50,
    backgroundColor: '#D3D3D3',
    alignItems: 'center',
  },
});
