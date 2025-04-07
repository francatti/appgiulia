export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    icon: string;
    createdAt: number;
  }
  
  export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }
  
  export type OrderStatus = 'pending' | 'completed' | 'cancelled';
  
  export interface Order {
    id: string;
    clientName: string;
    scheduledFor: number; // timestamp
    observations: string;
    items: OrderItem[];
    status: OrderStatus;
    createdAt: number;
  }