import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home/Home_Screen";
import Carrrinho from "../Screens/CarrinhoCompras/CarrinhoCompras";
import { Text, View } from "react-native";

export type TabsParamList = {
  Home_Tab: undefined;
  Carrinho_Tab: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export default function TabsRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home_Tab" component={() => <View><Text>OK Home_Tab</Text></View>} />
      <Tab.Screen name="Carrinho_Tab" component={() => <View><Text>OK Carrinho_Tab</Text></View>} />
    </Tab.Navigator>
  );
}
