import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
  Modal
} from 'react-native';
import { useOrderStore } from '@/store/order-store';
import { useProductStore } from '@/store/product-store';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { DateTimePicker } from '@/components/DateTimePicker';
import { ProductCard } from '@/components/ProductCard';
import { OrderItemCard } from '@/components/OrderItemCard';
import { useRouter, Stack } from 'expo-router';
import { formatCurrency } from '@/utils/date-utils';
import { OrderItem } from '@/types';
import { EmptyState } from '@/components/EmptyState';
import { Package, Plus, ShoppingCart, X } from 'lucide-react-native';

export default function NewOrderScreen() {
  const router = useRouter();
  const { addOrder } = useOrderStore();
  const { products } = useProductStore();
  
  const [clientName, setClientName] = useState('');
  const [scheduledFor, setScheduledFor] = useState(new Date());
  const [observations, setObservations] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const handleAddItem = (productId: string) => {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already exists in order
    const existingItem = items.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update quantity
      handleUpdateItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item
      setItems([
        ...items,
        {
          id: Date.now().toString(),
          productId,
          quantity: 1,
          price: product.price,
        },
      ]);
    }
    
    setShowProductModal(false);
  };
  
  const handleUpdateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    setItems(
      items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  
  const handleSave = () => {
    if (!clientName.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome do cliente');
      return;
    }
    
    if (items.length === 0) {
      Alert.alert('Erro', 'Por favor, adicione pelo menos um produto ao pedido');
      return;
    }
    
    setLoading(true);
    
    // Simulate a delay
    setTimeout(() => {
      addOrder({
        clientName: clientName.trim(),
        scheduledFor: scheduledFor.getTime(),
        observations: observations.trim(),
        items,
        status: 'pending',
      });
      
      setLoading(false);
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Novo Pedido',
          headerRight: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome do Cliente</Text>
              <TextInput
                style={styles.input}
                value={clientName}
                onChangeText={setClientName}
                placeholder="Digite o nome do cliente"
                placeholderTextColor={colors.textLight}
              />
            </View>
            
            <DateTimePicker
              value={scheduledFor}
              onChange={setScheduledFor}
              label="Agendado para"
            />
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Observações (Opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={observations}
                onChangeText={setObservations}
                placeholder="Digite instruções especiais ou notas"
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.itemsSection}>
              <View style={styles.itemsHeader}>
                <Text style={styles.itemsTitle}>Itens do Pedido</Text>
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={() => setShowProductModal(true)}
                >
                  <Plus size={16} color={colors.primary} />
                  <Text style={styles.addItemText}>Adicionar Item</Text>
                </TouchableOpacity>
              </View>
              
              {items.length > 0 ? (
                <View style={styles.itemsList}>
                  {items.map(item => (
                    <OrderItemCard
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleUpdateItemQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyItemsContainer}>
                  <EmptyState 
                    title="Nenhum item adicionado"
                    message="Adicione produtos a este pedido"
                    icon={<ShoppingCart size={48} color={colors.textLight} />}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
          </View>
          
          <Button
            title="Criar Pedido"
            onPress={handleSave}
            loading={loading}
            disabled={items.length === 0}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
      
      {/* Product Selection Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Produto</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            {products.length > 0 ? (
              <ScrollView style={styles.productList}>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={() => handleAddItem(product.id)}
                    compact
                  />
                ))}
              </ScrollView>
            ) : (
              <EmptyState 
                title="Nenhum produto disponível"
                message="Adicione produtos antes de criar um pedido"
                icon={<Package size={48} color={colors.textLight} />}
              />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  textArea: {
    minHeight: 100,
  },
  itemsSection: {
    marginTop: 16,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addItemText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  itemsList: {
    marginBottom: 16,
  },
  emptyItemsContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  productList: {
    maxHeight: 400,
  },
});