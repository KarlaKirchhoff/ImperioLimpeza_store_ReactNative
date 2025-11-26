import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home/Home_Screen";
import CadastrarProduto_Screen from "../Screens/CadastrarProduto/CadastrarProduto_Screen";
import HistoricoPedidos_Screen from "../Screens/HistoricoPedidos/HistoricoPedidos_Screen";
import CarrrinhoCompras_Screen from "../Screens/CarrinhoCompras/CarrinhoCompras";
import SobreNos_Screen from "../Screens/SobreNos/SobreNos_Screen";
import { RouteProp } from "@react-navigation/native";
import { DrawerParamList } from "./DrawerRoutes";

export type TabsParamList = {
  Home: undefined;
  HistoricoPedidos: undefined;
  CarrinhoCompras: undefined;
  CadastrarProduto: undefined;
  SobreNos: undefined;
};

type TabsRoutesProps = {
  route: RouteProp<DrawerParamList, keyof DrawerParamList>;
};


const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsRoutes({ route }: TabsRoutesProps) {
  const initialTab = route.params?.initialTab || "Home";
  return (
    <Tab.Navigator initialRouteName={initialTab} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} options={{ title: "Início" }} />
      <Tab.Screen name="CadastrarProduto" component={CadastrarProduto_Screen} options={{ title: "Cadastrar Produto" }} />
      <Tab.Screen name="HistoricoPedidos" component={HistoricoPedidos_Screen} options={{ title: "Historico de Pedidos" }} />
      <Tab.Screen name="CarrinhoCompras" component={CarrrinhoCompras_Screen} options={{ title: "Carrinho de Compras" }} />
      <Tab.Screen name="SobreNos" component={SobreNos_Screen} 
      options={{ title: "Sobre Nós", tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}
