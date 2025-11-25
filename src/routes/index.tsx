import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import DrawerRoutes from "./DrawerRoutes";
import type { Produto } from "../Screens/CadastrarProduto/CadastrarProduto_Screen";

import AuthScreens from "../Screens/Autenticacao/Autenticacao"
import Home from "../Screens/Home/Home_Screen";
import InfoProduto from "../Screens/Produto/Produto_Screen";
import SobreNos from "../Screens/SobreNos/SobreNos_Screen";
import HistoricoPedidos from "../Screens/HistoricoPedidos/HistoricoPedidos_Screen";
import CarrrinhoCompras from "../Screens/CarrinhoCompras/CarrinhoCompras";
import CadastrarProduto from "../Screens/CadastrarProduto/CadastrarProduto_Screen";


export type RootStackParamList = {
  Login: undefined;
  AppDrawer: undefined;
  Home: undefined;
  InfoProduto: Produto;
  SobreNos: undefined;
  HistoricoPedidos: undefined;
  CarrrinhoCompras: undefined;
  CadastrarProduto: undefined;
};


const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={AuthScreens}
        />
        <Stack.Screen
          name="Home"
          component={Home}
        />
        <Stack.Screen
          name="InfoProduto"
          component={InfoProduto}
        />
        <Stack.Screen
          name="SobreNos"
          component={SobreNos}
        />
        <Stack.Screen
          name="HistoricoPedidos"
          component={HistoricoPedidos}
        />
        <Stack.Screen
          name="CarrrinhoCompras"
          component={CarrrinhoCompras}
        />
        <Stack.Screen
          name="CadastrarProduto"
          component={CadastrarProduto}
        />
        <Stack.Screen
          name="AppDrawer"
          component={DrawerRoutes}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}