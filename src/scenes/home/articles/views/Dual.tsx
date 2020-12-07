import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { Subheading } from 'react-native-paper';

import { Illustration } from '@components/index';
import getStyles from '@styles/Styles';
import { useTheme } from '@utils/index';

import ArticleDisplay from '../../../display/articles/views/Display';
import { HomeTwoScreenNavigationProp } from '../../HomeTwo';
import ArticleList from './List';

type ArticleListDualProps = HomeTwoScreenNavigationProp<'Article'>;

const ArticleListDual: React.FC<ArticleListDualProps> = ({ navigation, route }) => {
  const [article, setArticle] = React.useState<{
    id: string;
    title: string;
    useLists: boolean;
  } | null>(null);

  const theme = useTheme();
  const styles = getStyles(theme);
  const { colors } = theme;

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <View style={{ flexGrow: 1, flex: 1 }}>
        <ArticleList
          navigation={navigation}
          route={route}
          dual
          setArticle={(a) => {
            setArticle(a);
          }}
        />
      </View>
      <View style={{ backgroundColor: colors.disabled, width: 1 }} />
      <View style={{ flexGrow: 2, flex: 1 }}>
        {article ? (
          <ArticleDisplay
            key={article.id}
            navigation={navigation}
            route={{
              key: 'ArticleDisplayDualPane',
              name: 'Display',
              params: {
                id: article.id,
                title: article.title,
                useLists: article.useLists,
                verification: false,
              },
            }}
            dual
          />
        ) : (
          <View style={styles.centerIllustrationContainer}>
            <Illustration name="article" width={500} height={500} />
            <Subheading>Séléctionnez un article</Subheading>
          </View>
        )}
      </View>
    </View>
  );
};

export default ArticleListDual;
