import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Gem, Heart, CreditCard } from "lucide-react-native";

import CatalogScreen from "./src/screens/CatalogScreen";
import DiamondDetailScreen from "./src/screens/DiamondDetailScreen";
import DigitalCardScreen from "./src/screens/DigitalCardScreen";
import WishlistScreen from "./src/screens/WishlistScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const STORAGE_WISHLIST_KEY = "@maa_diamond_wishlist";

export default function App() {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_WISHLIST_KEY);
        if (stored) setWishlist(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load wishlist:", e);
      }
    }
    loadWishlist();
  }, []);

  const toggleWishlist = async (id: string) => {
    const updated = wishlist.includes(id)
      ? wishlist.filter((item) => item !== id)
      : [...wishlist, id];
    setWishlist(updated);
    try {
      await AsyncStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  };

  function MainTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#d97706",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "#e2e8f0",
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
          },
        }}
      >
        <Tab.Screen
          name="CatalogTab"
          options={{
            tabBarLabel: "Diamond Vault",
            tabBarIcon: ({ color, size }) => <Gem size={size} color={color} />,
          }}
        >
          {(props) => (
            <CatalogScreen
              {...props}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="WishlistTab"
          options={{
            tabBarLabel: "Wishlist",
            tabBarIcon: ({ color, size }) => (
              <Heart
                size={size}
                color={color}
                fill={wishlist.length > 0 ? color : "transparent"}
              />
            ),
          }}
        >
          {(props) => (
            <WishlistScreen
              {...props}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="CardTab"
          component={DigitalCardScreen}
          options={{
            tabBarLabel: "Digital vCard",
            tabBarIcon: ({ color, size }) => (
              <CreditCard size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#0f172a",
          headerTitleStyle: { fontWeight: "800" },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DiamondDetail"
          options={({ route }: any) => ({
            title: route.params?.diamond?.stockNumber || "Diamond Details",
            headerBackTitle: "Vault",
          })}
        >
          {(props) => (
            <DiamondDetailScreen
              {...props}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
