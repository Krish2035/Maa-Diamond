import React, { useState, useEffect } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Home, Gem, Send, Heart, CreditCard } from "lucide-react-native";

import HomeScreen from "./src/screens/HomeScreen";
import CatalogScreen from "./src/screens/CatalogScreen";
import InquiryScreen from "./src/screens/InquiryScreen";
import DigitalCardScreen from "./src/screens/DigitalCardScreen";
import WishlistScreen from "./src/screens/WishlistScreen";
import DiamondDetailScreen from "./src/screens/DiamondDetailScreen";
import AuthModal from "./src/components/AuthModal";
import { AuthProvider } from "./src/context/AuthContext";
import { DiamondShape } from "./src/types";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const STORAGE_WISHLIST_KEY = "@maa_diamond_wishlist";

export default function App() {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [selectedShape, setSelectedShape] = useState<string>("All");

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
    const insets = useSafeAreaInsets();
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#d97706",
          tabBarInactiveTintColor: "#64748b",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopColor: "#e2e8f0",
            height: 56 + Math.max(insets.bottom, 0),
            paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "700",
          },
        }}
      >
        {/* 1. HOME & ABOUT US */}
        <Tab.Screen
          name="HomeTab"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color, size }) => <Home size={size - 2} color={color} />,
          }}
        >
          {(props) => (
            <HomeScreen
              {...props}
              wishlist={wishlist}
              onSelectShape={(shape: DiamondShape) => setSelectedShape(shape)}
            />
          )}
        </Tab.Screen>

        {/* 2. PRODUCTS (DIAMOND VAULT) */}
        <Tab.Screen
          name="ProductsTab"
          options={{
            tabBarLabel: "Products",
            tabBarIcon: ({ color, size }) => <Gem size={size - 2} color={color} />,
          }}
        >
          {(props) => (
            <CatalogScreen
              {...props}
              wishlist={wishlist}
              onToggleWishlist={toggleWishlist}
              selectedShape={selectedShape}
              onSelectShape={(s: string) => setSelectedShape(s)}
            />
          )}
        </Tab.Screen>

        {/* 3. WHOLESALE INQUIRY DESK */}
        <Tab.Screen
          name="InquiryTab"
          component={InquiryScreen}
          options={{
            tabBarLabel: "Inquiry",
            tabBarIcon: ({ color, size }) => <Send size={size - 2} color={color} />,
          }}
        />

        {/* 4. WISHLIST */}
        <Tab.Screen
          name="WishlistTab"
          options={{
            tabBarLabel: "Wishlist",
            tabBarBadge: wishlist.length > 0 ? wishlist.length : undefined,
            tabBarBadgeStyle: {
              backgroundColor: "#dc2626",
              fontSize: 9,
              fontWeight: "800",
              minWidth: 16,
              height: 16,
              lineHeight: 16,
            },
            tabBarIcon: ({ color, size }) => (
              <Heart
                size={size - 2}
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

        {/* 5. DIGITAL VCARD & CONTACT */}
        <Tab.Screen
          name="CardTab"
          component={DigitalCardScreen}
          options={{
            tabBarLabel: "Contact",
            tabBarIcon: ({ color, size }) => (
              <CreditCard size={size - 2} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
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

        {/* Global Auth Modal for Sign In, Sign Up & Profile Management */}
        <AuthModal />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
