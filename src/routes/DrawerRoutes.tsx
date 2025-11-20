import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabsRoutes from "./TabRoutes";
import CadastrarProduto from "../Screens/CadastrarProduto/CadastrarProduto_Screen";
import { Text, View } from "react-native";

export type DrawerParamList = {
  TabsRoutes: undefined;
  CadastrarProduto_Drawer: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerRoutes() {
  return (
    <Drawer.Navigator initialRouteName="TabsRoutes">
      <Drawer.Screen 
        name="TabsRoutes" 
        component={() => <View><Text>TabsRoutes OK</Text></View>} 
        options={{ title: "Início" }} 
      />

      <Drawer.Screen 
        name="CadastrarProduto_Drawer" 
        component={() => <View><Text>OK CadastrarProduto_Drawer</Text></View>} 
      />
    </Drawer.Navigator>
  );
}
