import React, { useEffect, useState } from "react";
import { createDrawerNavigator, DrawerNavigationProp } from "@react-navigation/drawer";
import TabRoutes, { TabsParamList } from "./TabRoutes";
import { getFocusedRouteNameFromRoute, useNavigation, useRoute } from "@react-navigation/native";

export type DrawerParamList = {
  Home_Tab: { initialTab?: keyof TabsParamList }
  SobreNos_Tab: { initialTab?: keyof TabsParamList };
  CadastrarProduto_Tab: { initialTab?: keyof TabsParamList };
  HistoricoPedidos_Tab: { initialTab?: keyof TabsParamList };
  CarrinhoCompras_Tab: { initialTab?: keyof TabsParamList };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator initialRouteName="Home_Tab">
      {/* Home abre o TabNavigator */}
      <Drawer.Screen
        name="Home_Tab"
        component={TabRoutes}
        options={{ title: "Início" }}
        initialParams={{ initialTab: "Home" }}
      />
      {/* SobreNos também abre o TabNavigator, mas com outra aba inicial */}
      <Drawer.Screen
        name="SobreNos_Tab"
        component={TabRoutes}
        options={{ title: "Sobre Nós" }}
        initialParams={{ initialTab: "SobreNos" }}
      />
      <Drawer.Screen
        name="CadastrarProduto_Tab"
        component={TabRoutes}
        options={{ title: "Cadastrar Produto" }}
        initialParams={{ initialTab: "CadastrarProduto" }}
      />
      <Drawer.Screen
        name="HistoricoPedidos_Tab"
        component={TabRoutes}
        options={{ title: "Histórico de Pedidos" }}
        initialParams={{ initialTab: "HistoricoPedidos" }}
      />
      <Drawer.Screen
        name="CarrinhoCompras_Tab"
        component={TabRoutes}
        options={{ title: "Carrinho de Compras" }}
        initialParams={{ initialTab: "CarrinhoCompras" }}
      />
    </Drawer.Navigator>
  );
}
