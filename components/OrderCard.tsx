import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Order } from '@/types';
import { colors } from '@/constants/colors';
import { formatTime, formatDate, formatCurrency } from '@/utils/date-utils';
import { useProductStore } from '@/store/product-store';
import { Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';

interface OrderCardProps {
  order: Order;
  onPress?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const { getProductById } = useProductStore();
  
  const totalAmount = order.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const getStatusColor = () => {
    switch (order.status) {
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.danger;
      default:
        return colors.warning;
    }
  };
  
  const getStatusIcon = () => {
    switch (order.status) {
      case 'completed':
        return <CheckCircle size={16} color={colors.success} />;
      case 'cancelled':
        return <XCircle size={16} color={colors.danger} />;
      default:
        return <AlertCircle size={16} color={colors.warning} />;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{formatDate(order.scheduledFor)}</Text>
          <View style={styles.timeContainer}>
            <Clock size={14} color={colors.textLight} />
            <Text style={styles.time}>{formatTime(order.scheduledFor)}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}15` }]}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>
      
      <View style={styles.clientContainer}>
        <User size={16} color={colors.textLight} />
        <Text style={styles.clientName}>{order.clientName}</Text>
      </View>
      
      {order.observations ? (
        <View style={styles.observationsContainer}>
          <FileText size={16} color={colors.textLight} />
          <Text style={styles.observations} numberOfLines={2}>
            {order.observations}
          </Text>
        </View>
      ) : null}
      
      <View style={styles.footer}>
        <Text style={styles.itemCount}>
          {totalItems} {totalItems === 1 ? 'item' : 'itens'}
        </Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  clientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 8,
  },
  observationsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  observations: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemCount: {
    fontSize: 14,
    color: colors.textLight,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});