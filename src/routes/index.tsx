import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home_Screen from "../Screens/Home/Home_Screen";
import Produto_Screen from "../Screens/Produto/Produto_Screen";
import HistoricoPedidos_Screen from "../Screens/HistoricoPedidos/HistoricoPedidos_Screen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// nav inferior
function TabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ headerShown: false, title:'Home' }}/>
    </Tab.Navigator>
  );
}

// pilha - Home
function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home_Screen} options={{ headerShown: false }} />
      <Stack.Screen name="InfoProduto" component={Produto_Screen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

// lateral
function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Principal" component={TabRoutes} options={{ title: 'Início' }}/>
      <Drawer.Screen name="Historico" component={HistoricoPedidos_Screen}  />
    </Drawer.Navigator>
  );
}

// App principal com Stack
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <TabRoutes />
    </NavigationContainer>
  );
}


