import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { useOrderStore } from '@/store/order-store';
import { colors } from '@/constants/colors';
import { OrderCard } from '@/components/OrderCard';
import { EmptyState } from '@/components/EmptyState';
import { formatDate } from '@/utils/date-utils';
import { useRouter } from 'expo-router';
import { Calendar, ChevronRight, Plus, ShoppingBag } from 'lucide-react-native';
import { Order } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { getOrdersByDate, getUpcomingOrders } = useOrderStore();
  const [refreshing, setRefreshing] = useState(false);
  
  const today = new Date();
  const todayOrders = getOrdersByDate(today).filter(order => order.status === 'pending');
  const upcomingOrders = getUpcomingOrders(7).filter(
    (order: Order) => {
      const orderDate = new Date(order.scheduledFor);
      const todayDate = new Date(today);
      
      // Remove today's orders from upcoming
      return orderDate.getDate() !== todayDate.getDate() || 
             orderDate.getMonth() !== todayDate.getMonth() || 
             orderDate.getFullYear() !== todayDate.getFullYear();
    }
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const groupOrdersByDate = (orders: Order[]): Record<string, Order[]> => {
    const grouped: Record<string, Order[]> = {};
    
    orders.forEach((order: Order) => {
      const date = new Date(order.scheduledFor);
      const dateStr = formatDate(date.getTime());
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      
      grouped[dateStr].push(order);
    });
    
    return grouped;
  };
  
  const groupedUpcomingOrders = groupOrdersByDate(upcomingOrders);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Bem-vindo(a) de volta!</Text>
          <Text style={styles.subtitle}>Gerencie seus pedidos de confeitaria</Text>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Calendar size={20} color={colors.primary} />
              <Text style={styles.sectionTitle}>Pedidos de Hoje</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push('/orders/new')}
            >
              <Plus size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {todayOrders.length > 0 ? (
            <View>
              {todayOrders.map((order: Order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onPress={() => router.push(`/orders/${order.id}`)}
                />
              ))}
            </View>
          ) : (
            <EmptyState 
              title="Sem pedidos para hoje"
              message="Você não tem nenhum pedido pendente agendado para hoje."
              icon={<ShoppingBag size={64} color={colors.textLight} />}
            />
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos Pedidos</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/orders')}
            >
              <Text style={styles.viewAllText}>Ver todos</Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {Object.keys(groupedUpcomingOrders).length > 0 ? (
            Object.entries(groupedUpcomingOrders).map(([date, orders]) => (
              <View key={date} style={styles.dateGroup}>
                <Text style={styles.dateHeader}>{date}</Text>
                {orders.map((order: Order) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onPress={() => router.push(`/orders/${order.id}`)}
                  />
                ))}
              </View>
            ))
          ) : (
            <EmptyState 
              title="Sem próximos pedidos"
              message="Você não tem nenhum pedido pendente agendado para os próximos 7 dias."
              icon={<Calendar size={64} color={colors.textLight} />}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 4,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 12,
  },
});