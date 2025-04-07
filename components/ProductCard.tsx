import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Product } from "@/types";
import { colors } from "@/constants/colors";
import { formatCurrency } from "@/utils/date-utils";
import * as Icons from "lucide-react-native";

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  compact = false,
}) => {
  // Convert kebab-case to PascalCase for icon name
  const pascalCaseIconName =
    product.icon.charAt(0).toUpperCase() + product.icon.slice(1);

  // @ts-ignore - dynamic icon import
  const IconComponent = Icons[pascalCaseIconName] || Icons.HelpCircle;

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.compactIconContainer}>
          <IconComponent size={20} color={colors.primary} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.compactPrice}>
            {formatCurrency(product.price)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.iconContainer}>
        <IconComponent size={28} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        {product.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.primary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
  },
  // Compact styles
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  compactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  compactContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  compactName: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
    flex: 1,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    marginLeft: 8,
  },
});
