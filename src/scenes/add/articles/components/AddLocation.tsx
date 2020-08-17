import React from "react";
import { View, Platform } from "react-native";
import {
  Button,
  RadioButton,
  HelperText,
  List,
  Text,
  useTheme,
} from "react-native-paper";

import { updateArticleCreationData } from "@redux/actions/contentData/articles";
import { StepperViewPageProps } from "@components/index";
import { Account, State } from "@ts/types";
import getStyles from "@styles/Styles";

import getAuthStyles from "../styles/Styles";
import { connect } from "react-redux";

type Props = StepperViewPageProps & { account: Account };

const ArticleAddPageGroup: React.FC<Props> = ({
  next,
  account,
  creationData,
}) => {
  const [schools, setSchools] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [global, setGlobal] = React.useState([]);
  const [showError, setError] = React.useState(false);

  const submit = () => {
    if (schools.length !== 0 || departments.length !== 0 || global) {
      updateArticleCreationData({});
      next();
    } else {
      setError(true);
    }
  };

  const theme = useTheme();
  const { colors } = theme;
  const articleStyles = getAuthStyles(theme);
  const styles = getStyles(theme);

  const selectedGroup = account.groups.find(
    (g) => g._id === creationData.group
  );
  const selectedGroupLocation =
    selectedGroup &&
    selectedGroup.roles
      ?.find((r) => r._id === selectedGroup.membership.role)
      ?.permissions.find((p) => p.permission === "article.add")?.scope;

  if (!account.loggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.centerIllustrationContainer}>
          <Text>Non autorisé</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={articleStyles.formContainer}>
      <View style={articleStyles.listContainer}>
        {selectedGroupLocation?.schools.map((s) => (
          <List.Item
            title={s.name}
            description={`École`}
            left={() =>
              Platform.OS !== "ios" ? (
                <RadioButton
                  status={group === g._id ? "checked" : "unchecked"}
                  color={colors.primary}
                  onPress={() => {
                    setError(false);
                    setGroup(g._id);
                  }}
                />
              ) : null
            }
            right={() =>
              Platform.OS === "ios" ? (
                <RadioButton
                  status={group === g._id ? "checked" : "unchecked"}
                  color={colors.primary}
                  onPress={() => {
                    setError(false);
                    setGroup(g._id);
                  }}
                />
              ) : null
            }
            onPress={() => {
              setError(false);
              setGroup(g._id);
            }}
          />
        ))}
        <HelperText visible={showError}>
          Vous devez selectionner un groupe
        </HelperText>
      </View>
      <View style={articleStyles.buttonContainer}>
        <Button
          mode={Platform.OS !== "ios" ? "contained" : "outlined"}
          uppercase={Platform.OS !== "ios"}
          onPress={() => submit()}
          style={{ flex: 1, marginLeft: 5 }}
        >
          Suivant
        </Button>
      </View>
    </View>
  );
};

const mapStateToProps = (state: State) => {
  const { account, articles } = state;
  return { account, creationData: articles.creationData };
};

export default connect(mapStateToProps)(ArticleAddPageGroup);
