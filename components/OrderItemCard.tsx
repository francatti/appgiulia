import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OrderItem } from '@/types';
import { colors } from '@/constants/colors'
import { formatCurrency } from '@/utils/date-utils';
import { useProductStore } from '@/store/product-store';
import { Minus, Plus, Trash2 } from 'lucide-react-native';

interface OrderItemCardProps {
  item: OrderItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const OrderItemCard: React.FC<OrderItemCardProps> = ({ 
  item, 
  onUpdateQuantity,
  onRemove
}) => {
  const { getProductById } = useProductStore();
  const product = getProductById(item.productId);
  
  if (!product) {
    return null;
  }
  
  const totalPrice = item.price * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>{formatCurrency(item.price)}</Text>
      </View>
      
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus size={16} color={item.quantity <= 1 ? colors.textLight : colors.text} />
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <Trash2 size={16} color={colors.danger} />
        </TouchableOpacity>
        
        <Text style={styles.totalPrice}>{formatCurrency(totalPrice)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  productPrice: {
    fontSize: 15,
    color: colors.textLight,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    padding: 4,
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});