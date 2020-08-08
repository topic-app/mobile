import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
// import { useColorScheme, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { connect } from "react-redux";

import { Preferences, State } from "@ts/types";
import themes from "@styles/Theme";
import { fetchLocationData } from "@redux/actions/data/location";
import { fetchGroups, fetchAccount } from "@redux/actions/data/account";
import AppNavigator from "./index";
import { Text } from "react-native";

type Props = {
  preferences: Preferences;
};

const StoreApp: React.FC<Props> = ({ preferences }) => {
  let theme = themes[preferences.theme] || "light";

  const colorScheme = "light"; // useColorScheme();

  if (preferences.useSystemTheme) {
    theme = themes[colorScheme === "dark" ? "dark" : "light"];
  }

  React.useEffect(
    React.useCallback(() => {
      fetchLocationData().catch((e) =>
        console.log(`fetchLocationData err ${e}`)
      );
      fetchGroups().catch((e) => console.log(`fetchGroups err ${e}`));
      fetchAccount().catch((e) => console.log(`fetchAccount err ${e}`));
    }, [null])
  );

  return (
    <PaperProvider theme={theme}>
      <React.Fragment>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </React.Fragment>
    </PaperProvider>
  );
};

const mapStateToProps = (state: State) => {
  const { preferences } = state;
  return { preferences };
};

export default connect(mapStateToProps)(StoreApp);
