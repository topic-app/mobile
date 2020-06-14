import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { useTheme, Text } from 'react-native-paper';
import { PieChart } from 'react-native-svg-charts';
import { G, Path } from 'react-native-svg';
import shortid from 'shortid';

const showNumbers = false;

function getPath(startAngle, endAngle, startCoords, index, amtSections) {
  // Array destructuring
  const [x1, y1] = startCoords;
  // Get angle of the middle of the slice
  const angle = startAngle - Math.PI / 2 + Math.abs(startAngle - endAngle) / 2;
  // Determine pie radius / 2
  const pieThickness = Math.sqrt(x1 ** 2 + y1 ** 2) / 2;

  // x coordinate where lines won't cross other sections
  const safeX = 84 + index;
  // x Coordinate where the line should finish
  const targetX = safeX + 15;
  // Target y coordinate
  const targetY = 20 - (amtSections / 2 - index) * 38.2;
  // How strong the slope is
  const slope = 0;

  const x2 = x1 + Math.cos(angle) * pieThickness; // red
  const y2 = y1 + Math.sin(angle) * pieThickness;
  const b1x = safeX; // blue
  const b1y = (y2 + targetY) / 2;
  const b1x1 = safeX + slope; // yellow
  const b1y1 = y2 + slope;

  const b2x = targetX;
  const b2y = targetY;
  const b2x1 = safeX - slope;
  const b2y1 = targetY - slope;

  return `M${x1} ${y1} L ${x2} ${y2} Q ${b1x1} ${b1y1} ${b1x} ${b1y} Q ${b2x1} ${b2y1} ${b2x} ${b2y}`;
}

function PieLabels({ slices }) {
  return slices.map((slice, index) => {
    const { pieCentroid, data, startAngle, endAngle } = slice;
    if (startAngle < (3 / 4) * Math.PI) {
      const linePath = getPath(startAngle, endAngle, pieCentroid, index, slices.length);
      return (
        <G key={shortid()}>
          <Path d={linePath} fill="none" stroke={data.svg.fill} strokeWidth={2} />
        </G>
      );
    }
    return null;
  });
}

function MultiVote({ items, barColors, showAllLabels }) {
  const theme = useTheme();

  const pieData = items
    .filter((item) => item.votes > 0)
    .map((item, index) => ({
      key: `pie-${index}`,
      title: item.title,
      value: item.votes,
      svg: { fill: barColors[index] },
      arc: {
        outerRadius: index === 0 ? '110%' : '100%',
        cornerRadius: theme.roundness,
      },
    }));

  const total = items.map((item) => item.votes).reduce((sum, val) => sum + val);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <PieChart
        style={{ width: '50%' }}
        data={pieData}
        innerRadius="25%"
        padAngle={0.03}
        outerRadius="80%"
        labelRadius="100%"
      >
        <PieLabels showTitle={showAllLabels} />
      </PieChart>
      <View
        style={{
          width: '50%',
          merginVertical: 7,
          paddingRight: 35,
          borderRadius: theme.roundness,
        }}
      >
        {items.map((item, index) => (
          <View key={shortid()} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                height: showNumbers ? 20 : 14,
                width: showNumbers ? 20 : 14,
                borderRadius: theme.roundness,
                marginRight: 7,
                backgroundColor: barColors[index],
                alignItems: 'center',
              }}
            >
              {showNumbers && !showAllLabels && (
                <Text
                  style={{
                    color: 'white',
                    textShadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    textShadowColor: 'black',
                    textShadowRadius: 1,
                  }}
                >
                  {index + 1}
                </Text>
              )}
            </View>
            <View style={{ marginBottom: 3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15 }} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 13, lineHeight: 14 }} numberOfLines={1}>
                {item.votes} votes ({Math.round((item.votes / total) * 100)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

export default MultiVote;

MultiVote.defaultProps = {
  showAllLabels: false,
};

MultiVote.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      votes: PropTypes.number.isRequired,
    }),
  ).isRequired,
  barColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  showAllLabels: PropTypes.bool,
};
