import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabsRoutes from "./TabRoutes";

import Home from "../Screens/Home/Home_Screen";
import InfoProduto from "../Screens/Produto/Produto_Screen";
import SobreNos from "../Screens/SobreNos/SobreNos_Screen";
import HistoricoPedidos from "../Screens/HistoricoPedidos/HistoricoPedidos_Screen";
import CarrrinhoCompras from "../Screens/CarrinhoCompras/CarrinhoCompras";
import CadastrarProduto from "../Screens/CadastrarProduto/CadastrarProduto_Screen";

export type DrawerParamList = {
  TabsRoutes: undefined;
  CadastrarProduto_Drawer: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator initialRouteName="TabsRoutes">
      <Drawer.Screen 
        name="CadastrarProduto_Drawer" 
        component={CadastrarProduto} 
      />
      <Drawer.Screen 
        name="TabsRoutes" 
        component={TabsRoutes} 
        options={{ title: "Início" }} 
      />
    </Drawer.Navigator>
  );
}
