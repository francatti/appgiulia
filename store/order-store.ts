import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderItem, OrderStatus } from '@/types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrder: (id: string, order: Partial<Omit<Order, 'id' | 'createdAt'>>) => void;
  deleteOrder: (id: string) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByDate: (date: Date) => Order[];
  getUpcomingOrders: (days: number) => Order[];
  completeOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (order) => {
        const newOrder: Order = {
          ...order,
          id: Date.now().toString(),
          createdAt: Date.now(),
        };
        
        set((state) => ({
          orders: [...state.orders, newOrder],
        }));
      },
      
      updateOrder: (id, updatedOrder) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, ...updatedOrder } : order
          ),
        }));
      },
      
      deleteOrder: (id) => {
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        }));
      },
      
      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },
      
      getOrdersByDate: (date) => {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        
        return get().orders.filter((order) => {
          const orderDate = new Date(order.scheduledFor);
          return orderDate >= startOfDay && orderDate <= endOfDay;
        });
      },
      
      getUpcomingOrders: (days) => {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        
        const endDate = new Date(now);
        endDate.setDate(now.getDate() + days);
        endDate.setHours(23, 59, 59, 999);
        
        return get().orders.filter((order) => {
          const orderDate = new Date(order.scheduledFor);
          return orderDate >= startOfToday && orderDate <= endDate && order.status === 'pending';
        }).sort((a, b) => a.scheduledFor - b.scheduledFor);
      },
      
      completeOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, status: 'completed' as OrderStatus } : order
          ),
        }));
      },
      
      cancelOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((order) => 
            order.id === id ? { ...order, status: 'cancelled' as OrderStatus } : order
          ),
        }));
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);