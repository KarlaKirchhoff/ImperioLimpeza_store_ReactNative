import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home/Home_Screen";
import CadastrarProduto_Screen from "../Screens/CadastrarProduto/CadastrarProduto_Screen";
import HistoricoPedidos_Screen from "../Screens/HistoricoPedidos/HistoricoPedidos_Screen";
import CarrrinhoCompras_Screen from "../Screens/CarrinhoCompras/CarrinhoCompras";
import SobreNos_Screen from "../Screens/SobreNos/SobreNos_Screen";
import { getFocusedRouteNameFromRoute, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { DrawerParamList } from "./DrawerRoutes";
import { DrawerNavigationProp } from "@react-navigation/drawer";

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
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  const titles: Record<keyof TabsParamList, string> = {
    Home: "Início",
    CadastrarProduto: "Novo Produto",
    HistoricoPedidos: "Histórico de Pedidos",
    CarrinhoCompras: "Carrinho",
    SobreNos: "Sobre Nós",
  };

  useEffect(() => {
    const focused = getFocusedRouteNameFromRoute(route) as keyof TabsParamList | undefined;

    const title = focused ? titles[focused] : "Início"; // fallback

    navigation.setOptions({
      title,
    });
  }, [route, navigation]);


  return (
    <Tab.Navigator initialRouteName={initialTab} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={Home} options={{ title: "Início" }} />
      <Tab.Screen name="CadastrarProduto" component={CadastrarProduto_Screen} options={{ title: "Novo Produto" }} />
      <Tab.Screen name="HistoricoPedidos" component={HistoricoPedidos_Screen} options={{ title: "Historico" }} />
      <Tab.Screen name="CarrinhoCompras" component={CarrrinhoCompras_Screen} options={{ title: "Carrinho" }} />
      <Tab.Screen name="SobreNos" component={SobreNos_Screen}
        options={{ title: "Sobre Nós", tabBarButton: () => null }} />
    </Tab.Navigator>
  );
}
