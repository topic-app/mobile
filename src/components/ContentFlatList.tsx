import React from 'react';
import {
  FlatList,
  FlatListProps,
  SectionListProps,
  Animated,
  RefreshControl,
  View,
  Platform,
  AccessibilityInfo,
  ListRenderItemInfo,
  ActivityIndicator,
} from 'react-native';
import { Subheading, Text } from 'react-native-paper';

import getStyles from '@styles/Styles';
import { useTheme } from '@utils';

import Banner from './Banner';
import TabChipList from './TabChipList';

export type Section<T extends any> = {
  key: string;
  title: string;
  description?: string;
  icon?: string;
  data: T[];
  loading?: {
    next?: boolean;
    refresh?: boolean;
  };
  onLoad?: (type: 'initial' | 'next' | 'refresh') => unknown;
};

type SectionWithGroup<T extends any> = Section<T> & { group?: string };

export type ContentSection<T extends any> = SectionWithGroup<T>;

type Props<T extends any> = Omit<
  SectionListProps<T, SectionWithGroup<T>>,
  // Remove props from react-native's sectionlist to overwrite them
  | 'refreshControl'
  | 'refreshing'
  | 'onRefresh'
  | 'ref'
  | 'ListHeaderComponent'
  | 'ListEmptyComponent'
  | 'renderItem'
  | 'getItemLayout'
> & {
  // Custom props
  flatListRef?: React.Ref<FlatList>;
  scrollY?: Animated.Value;
  initialSection?: string;
  itemHeight?: number;
  onConfigurePress?: () => any;

  // Overwrite React Native's definition because we're not going to handle all cases
  ListHeaderComponent?: React.ComponentType<{
    group?: string;
    sectionKey: string;
    retry?: () => any;
  }>;
  ListEmptyComponent?: React.ComponentType<{
    group?: string;
    sectionKey: string;
    changeTab: (newTab: string) => Promise<void>;
  }>;
  renderItem: React.ComponentType<ListRenderItemInfo<T> & { group?: string; sectionKey: string }>;
};

const ContentFlatList = <T extends any>({
  flatListRef,
  scrollY,
  sections,
  ListHeaderComponent,
  ListEmptyComponent,
  itemHeight,
  onConfigurePress,
  renderItem: Item,
  initialSection,
  ...props
}: Props<T>) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = getStyles(theme);

  // Get basic data from sections
  const [tabKey, setTabKey] = React.useState(
    initialSection || sections[0]?.key || 'shouldNotRender',
  );
  const currentSection = sections.find((sec) => sec.key === tabKey)!;

  // Logic for animation
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const renderItemFadeAnim = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Early return if nothing to render
  if (sections.length === 0) {
    return null;
  }

  // Decides whether the flatlist should be Animated or not
  const FlatListComponent = scrollY ? Animated.FlatList : FlatList;
  const extraFlatListProps: Partial<FlatListProps<T>> = scrollY
    ? {
        onScroll: Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        }),
      }
    : {};

  // Builds sections
  const tabs: { [key: string]: Section<T>[] } = {};

  // Loop through all sections and create groups of sections for TabChipList
  sections.forEach(({ group, ...section }) => {
    if (group) {
      if (group in tabs) {
        tabs[group].push(section);
      } else {
        tabs[group] = [section];
      }
    } else if ('nogroup' in tabs) {
      tabs.nogroup.push(section);
    } else {
      tabs.nogroup = [section];
    }
  });

  // Helper function to display animation when switching lists and refreshes
  const changeList = async (newTabKey: string) => {
    const shouldSkipAnimation =
      Platform.OS !== 'web' ? await AccessibilityInfo.isReduceMotionEnabled() : false;

    const nextSectionData = sections.find((sec) => sec.key === newTabKey)!.data;
    if (shouldSkipAnimation) {
      setTabKey(newTabKey);
      // If the function returns a promise, wait until it is resolved
      if (nextSectionData.length === 0) {
        await currentSection.onLoad?.('initial');
      }
    } else {
      Animated.timing(fadeAnim, {
        useNativeDriver: true,
        toValue: 0,
        duration: 200,
      }).start(async () => {
        setTabKey(newTabKey);
        // If the function returns a promise, wait until it is resolved
        if (nextSectionData.length === 0) {
          await currentSection.onLoad?.('initial');
        }
        Animated.timing(fadeAnim, {
          useNativeDriver: true,
          toValue: 1,
          duration: 200,
        }).start();
      });
    }
  };

  // FlatList optimizations
  const getItemLayout = itemHeight
    ? (data: unknown, index: number) => {
        return { length: itemHeight, offset: itemHeight * index, index };
      }
    : undefined;

  const shouldRenderTabChipList = sections.length > 1;

  return (
    <View>
      <FlatListComponent<T>
        //        Note: ↑ this is a TypeScript Generic, not a React component
        ref={flatListRef}
        data={currentSection.data}
        refreshControl={
          currentSection.loading && currentSection.onLoad ? (
            <RefreshControl
              colors={[colors.primary]}
              refreshing={!!currentSection.loading.refresh}
              onRefresh={() => currentSection.onLoad?.('refresh')}
              progressBackgroundColor={colors.highlight}
            />
          ) : undefined
        }
        ListHeaderComponent={() => (
          <View>
            {ListHeaderComponent ? (
              <ListHeaderComponent
                sectionKey={tabKey}
                group={currentSection.group}
                retry={() => currentSection.onLoad?.('initial')}
              />
            ) : null}
            {shouldRenderTabChipList ? (
              <TabChipList
                sections={Object.entries(tabs).map(([key, data]) => ({ key, data }))}
                selected={tabKey}
                setSelected={changeList}
                configure={onConfigurePress}
              />
            ) : null}
            {currentSection.description ? (
              <Banner actions={[]} visible>
                <Subheading>Description{'\n'}</Subheading>
                <Text>{currentSection.description}</Text>
              </Banner>
            ) : null}
          </View>
        )}
        ListEmptyComponent={() => (
          <Animated.View style={{ opacity: fadeAnim }}>
            {ListEmptyComponent ? (
              <ListEmptyComponent
                sectionKey={tabKey}
                group={currentSection.group}
                changeTab={changeList}
              />
            ) : null}
          </Animated.View>
        )}
        ListFooterComponent={
          <View style={[styles.container, { height: 50 }]}>
            {currentSection.loading?.next && (
              <ActivityIndicator size="large" color={colors.primary} />
            )}
          </View>
        }
        renderItem={(itemProps) => (
          <>
            <Item {...itemProps} sectionKey={tabKey} group={currentSection.group} />
            <Animated.View
              style={{
                opacity: renderItemFadeAnim,
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: colors.background,
              }}
            />
          </>
        )}
        getItemLayout={getItemLayout}
        onEndReachedThreshold={0.5}
        onEndReached={() => currentSection.onLoad?.('next')}
        {...extraFlatListProps}
        {...props}
      />
    </View>
  );
};

export default ContentFlatList;