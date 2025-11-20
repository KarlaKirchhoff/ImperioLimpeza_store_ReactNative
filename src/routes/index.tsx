import React from "react";

import DrawerRoutes from "./DrawerRoutes";
import AuthScreens from "../Screens/Autenticacao/Autenticacao"
import Home from "../Screens/Home/Home_Screen";
import InfoProduto from "../Screens/Produto/Produto_Screen";
import type { Produto } from "../Screens/CadastrarProduto/CadastrarProduto_Screen";
import { View } from "react-native";
import { Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  AppDrawer: undefined;
  Home: undefined;
  InfoProduto: Produto;
};


const Stack = createNativeStackNavigator();

console.log(createNativeStackNavigator);
console.log(NavigationContainer);
console.log(AuthScreens);
console.log(Home);
console.log(InfoProduto);
console.log(Stack);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={() => (
            <View><Text>Teste OK</Text></View>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}