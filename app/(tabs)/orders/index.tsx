import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { useOrderStore } from '@/store/order-store';
import { colors } from '@/constants/colors';
import { OrderCard } from '@/components/OrderCard';
import { EmptyState } from '@/components/EmptyState';
import { useRouter } from 'expo-router';
import { Plus, ShoppingBag } from 'lucide-react-native';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrderStore();
  const [refreshing, setRefreshing] = useState(false);
  
  // Sort orders by date (newest first)
  const sortedOrders = [...orders].sort((a, b) => b.scheduledFor - a.scheduledFor);
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todos os Pedidos</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/orders/new')}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      {sortedOrders.length > 0 ? (
        <FlatList
          data={sortedOrders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard 
              order={item} 
              onPress={() => router.push(`/orders/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <EmptyState 
          title="Nenhum pedido ainda"
          message="Crie seu primeiro pedido para começar."
          icon={<ShoppingBag size={64} color={colors.textLight} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
});