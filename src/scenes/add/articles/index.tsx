import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { HeaderConfig } from "@components/Header";
import ArticleAdd from "./views/Add";

const Stack = createStackNavigator();

function ArticleAddStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Add">
      <Stack.Screen
        name="Add"
        component={ArticleAdd}
        options={{
          title: "Écrire un article",
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ArticleAddStackNavigator;
