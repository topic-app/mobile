import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import { Text, Card, useTheme } from 'react-native-paper';
import Avatar from '@components/Avatar';
import { PlatformTouchable } from '@components/PlatformComponents';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import getStyles from '@styles/Styles';

function InlineCard({ title, subtitle, onPress, badge, badgeColor, icon, imageUrl }) {
  const { colors } = useTheme();

  const cardContents = (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        minHeight: 40,
      }}
    >
      {icon || imageUrl ? <Avatar size={50} imageUrl={imageUrl} icon={icon} /> : null}
      <View style={{ paddingLeft: 15, alignSelf: 'center' }}>
        <Text style={{ fontSize: 16 }}>
          {title}
          {'  '}
          {badge && <Icon color={badgeColor || colors.icon} name={badge} size={16} />}
        </Text>
        {subtitle && <Text style={{ color: colors.subtext }}>{subtitle}</Text>}
      </View>
    </View>
  );

  return onPress ? (
    <PlatformTouchable onPress={onPress}>{cardContents}</PlatformTouchable>
  ) : (
    cardContents
  );
}

function CardBase({ onPress, style, contentContainerStyle, children }) {
  const styles = getStyles(useTheme());

  return onPress ? (
    <Card style={[styles.card, style]}>
      <PlatformTouchable onPress={onPress}>
        <View style={[{ paddingTop: 10, paddingBottom: 5 }, contentContainerStyle]}>
          {children}
        </View>
      </PlatformTouchable>
    </Card>
  ) : (
    <Card style={[styles.card, style]}>
      <View style={[{ paddingTop: 10, paddingBottom: 5 }, contentContainerStyle]}>{children}</View>
    </Card>
  );
}

export { InlineCard, CardBase };

InlineCard.defaultProps = {
  icon: null,
  imageUrl: null,
  subtitle: null,
  badge: null,
  badgeColor: null,
  onPress: null,
};

InlineCard.propTypes = {
  icon: PropTypes.string,
  imageUrl: PropTypes.string,
  badge: PropTypes.string,
  badgeColor: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

CardBase.defaultProps = {
  onPress: null,
  style: null,
  contentContainerStyle: null,
};

CardBase.propTypes = {
  onPress: PropTypes.func,
  style: ViewPropTypes.style,
  contentContainerStyle: ViewPropTypes.style,
  children: PropTypes.node.isRequired,
};
