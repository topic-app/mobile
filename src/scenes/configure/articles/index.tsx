import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HeaderConfig } from "@components/Header";
import ArticleConfigure from "./views/Configure";

const Stack = createStackNavigator();

function ArticleListsStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Configure">
      <Stack.Screen
        name="Configure"
        component={ArticleConfigure}
        options={({ route }) => ({
          ...HeaderConfig,
          title: "Actus",
          subtitle: "Configurer",
        })}
      />
    </Stack.Navigator>
  );
}

export default ArticleListsStackNavigator;
