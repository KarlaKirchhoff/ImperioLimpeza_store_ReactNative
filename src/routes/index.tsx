import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./DrawerRoutes";
import AuthScreens from "../Screens/Autenticacao/Autenticacao";
import InfoProduto from "../Screens/Produto/Produto_Screen";
import { Produto } from "../types/interface";

export type RootStackParamList = {
  Login: undefined;
  AppDrawer: undefined;
  Home: undefined;
  InfoProduto: Produto;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={AuthScreens}
        />
        <Stack.Screen
          name="AppDrawer"
          component={DrawerRoutes}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="InfoProduto" component={InfoProduto} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}