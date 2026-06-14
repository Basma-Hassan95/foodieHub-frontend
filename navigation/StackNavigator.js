import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import CartScreen from "../screen/CartScreen.js";
import EditProfileScreen from "../screen/EditProfileScreen.js";
import HomeScreen from "../screen/HomeScreen.js";
import LoginScreen from "../screen/LoginScreen.js";
import PaymentScreen from "../screen/PaymentScreen.js";
import PaynowScreen from "../screen/PaynowScreen.js";
import ProfileScreen from "../screen/ProfileScreen.js";
import RegisterScreen from "../screen/RegisterScreen.js";
import ShoppingCartScreen from "../screen/ShoppingCartScreen.js";
import SplashScreen from "../screen/SplashScreen.js";
import OrderHistoryScreen from "../screen/OrderHistoryScreen.js";


const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
      function BottomTabs() {
        return (
          <Tab.Navigator>
            <Tab.Screen
              name="Home - FoodieHub"
              component={HomeScreen}
              options={{
                tabBarLabel: "Home",
                tabBarLabelStyle: { color: "#E67E22" },
                // headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Entypo name="home" size={24} color="#E67E22" />
                  ) : (
                    <AntDesign name="home" size={24} color="black" />
                  ),
              }}
            />
    
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarLabel: "Profile",
                tabBarLabelStyle: { color: "#E67E22" },
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Ionicons name="person" size={24} color="#E67E22" />
                  ) : (
                    <Ionicons name="person-outline" size={24} color="black" />
                  ),
              }}
            />
    
            <Tab.Screen
              name="Cart"
              component={CartScreen}
              options={{
                tabBarLabel: "Cart",
                tabBarLabelStyle: { color: "#E67E22" },
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <AntDesign name="shoppingcart" size={24} color="#E67E22" />
                  ) : (
                    <AntDesign name="shoppingcart" size={24} color="black" />
                  ),
              }}
            />
          </Tab.Navigator>
        );
      }

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          // options={{ headerShown: false }}
        />
                   <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }}/> 

        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen

          name="ShoppingCart"
          component={ShoppingCartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="payment"
          component={PaynowScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentReceipt"
          component={PaymentScreen}
          // options={{ headerShown: false }}
        />
        
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
       


      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default StackNavigator;

const styles = StyleSheet.create({});
