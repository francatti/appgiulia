import React from "react";
import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { Home, Package, ShoppingBag } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarInactiveBackgroundColor: colors.background,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 18,
          color: colors.textHeader,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive,
              ]}
            >
              <Home
                size={24}
                color={focused ? colors.primary : colors.textLight}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders/index"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive,
              ]}
            >
              <ShoppingBag
                size={24}
                color={focused ? colors.primary : colors.textLight}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="products/index"
        options={{
          title: "Produtos",
          tabBarIcon: ({ focused, color }) => (
            <View
              style={[
                styles.tabIconContainer,
                focused && styles.tabIconContainerActive,
              ]}
            >
              <Package
                size={24}
                color={focused ? colors.primary : colors.textLight}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 99, // Torna o item circular
    backgroundColor: colors.background, // Fundo padrão
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16, // Espaçamento inferior para o ícone
  },
  tabIconContainerActive: {
    backgroundColor: `${colors.primary}30`, // Fundo destacado para a aba ativa
  },
  tabIconContainerInactive: {
    backgroundColor: colors.primary, // Fundo padrão para a aba inativa
  },
});
