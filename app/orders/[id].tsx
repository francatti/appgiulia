import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from "react-native";
import { useOrderStore } from "@/store/order-store";
import { useProductStore } from "@/store/product-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { OrderItemCard } from "@/components/OrderItemCard";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { formatDateTime, formatCurrency } from "@/utils/date-utils";
import { OrderItem, OrderStatus } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";
import { SafeAreaView as SafeAreaViewNative } from "react-native-safe-area-context";
import {
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Package,
  Plus,
  Trash2,
  User,
  X,
  XCircle,
} from "lucide-react-native";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getOrderById, updateOrder, deleteOrder, completeOrder, cancelOrder } =
    useOrderStore();
  const { products, getProductById } = useProductStore();

  const order = getOrderById(id as string);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);

  useEffect(() => {
    if (order) {
      setItems(order.items);
    } else {
      // Order not found, go back
      Alert.alert("Erro", "Pedido não encontrado");
      router.back();
    }
  }, [order]);

  if (!order) {
    return null;
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddItem = (productId: string) => {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    // Check if product already exists in order
    const existingItem = items.find((item) => item.productId === productId);

    if (existingItem) {
      // Update quantity
      handleUpdateItemQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      // Add new item
      const newItems = [
        ...items,
        {
          id: Date.now().toString(),
          productId,
          quantity: 1,
          price: product.price,
        },
      ];

      setItems(newItems);
      updateOrder(order.id, { items: newItems });
    }

    setShowProductModal(false);
  };

  const handleUpdateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );

    setItems(newItems);
    updateOrder(order.id, { items: newItems });
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = items.filter((item) => item.id !== itemId);
    setItems(newItems);
    updateOrder(order.id, { items: newItems });
  };

  const handleCompleteOrder = () => {
    completeOrder(order.id);
    setShowActionsModal(false);
  };

  const handleCancelOrder = () => {
    cancelOrder(order.id);
    setShowActionsModal(false);
  };

  const handleDeleteOrder = () => {
    Alert.alert(
      "Excluir Pedido",
      "Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            deleteOrder(order.id);
            router.back();
          },
        },
      ]
    );
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "completed":
        return colors.success;
      case "cancelled":
        return colors.danger;
      default:
        return colors.warning;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case "pending":
        return "Pendente";
      case "completed":
        return "Concluído";
      case "cancelled":
        return "Cancelado";
      default:
        return "Pendente";
    }
  };
  const CustomHeader = () => (
    <SafeAreaViewNative style={styles.safeAreaHeader}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
        <TouchableOpacity
          onPress={() => {
            console.log("Botão de ações pressionado");
            setShowActionsModal(true);
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>Ações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaViewNative>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalhes do Pedido",
          header: () => <CustomHeader />,
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.orderHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor()}15` },
            ]}
          >
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <User size={20} color={colors.textLight} />
            <Text style={styles.infoLabel}>Cliente:</Text>
            <Text style={styles.infoValue}>{order.clientName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Calendar size={20} color={colors.textLight} />
            <Text style={styles.infoLabel}>Agendado para:</Text>
            <Text style={styles.infoValue}>
              {formatDateTime(order.scheduledFor)}
            </Text>
          </View>

          {order.observations ? (
            <View style={styles.observationsContainer}>
              <View style={styles.infoRow}>
                <FileText size={20} color={colors.textLight} />
                <Text style={styles.infoLabel}>Observações:</Text>
              </View>
              <Text style={styles.observations}>{order.observations}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.itemsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Itens do Pedido</Text>
            {order.status === "pending" && (
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={() => setShowProductModal(true)}
              >
                <Plus size={16} color={colors.primary} />
                <Text style={styles.addItemText}>Adicionar Item</Text>
              </TouchableOpacity>
            )}
          </View>

          {items.length > 0 ? (
            <View style={styles.itemsList}>
              {items.map((item) => (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateItemQuantity}
                  onRemove={handleRemoveItem}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              title="Nenhum item neste pedido"
              message="Adicione produtos a este pedido"
              icon={<Package size={48} color={colors.textLight} />}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalAmount)}</Text>
        </View>
      </View>

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
              <Text style={styles.modalTitle}>Adicionar Produto</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.productList}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => handleAddItem(product.id)}
                  compact
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Actions Modal */}
      <Modal
        visible={showActionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowActionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ações do Pedido</Text>
              <TouchableOpacity onPress={() => setShowActionsModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.actionsList}>
              {order.status === "pending" && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.completeButton]}
                    onPress={handleCompleteOrder}
                  >
                    <CheckCircle size={20} color={colors.success} />
                    <Text style={[styles.actionText, styles.completeText]}>
                      Marcar como Concluído
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={handleCancelOrder}
                  >
                    <XCircle size={20} color={colors.danger} />
                    <Text style={[styles.actionText, styles.cancelText]}>
                      Cancelar Pedido
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDeleteOrder}
              >
                <Trash2 size={20} color={colors.danger} />
                <Text style={[styles.actionText, styles.deleteText]}>
                  Excluir Pedido
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaHeader: {
    backgroundColor: colors.background, // Garante que o fundo do cabeçalho seja consistente
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },
  headerButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  orderHeader: {
    padding: 16,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.text,
    marginLeft: 8,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  observationsContainer: {
    marginTop: 8,
  },
  observations: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 28,
  },
  itemsSection: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addItemText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  itemsList: {
    marginBottom: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  productList: {
    maxHeight: 400,
  },
  actionsList: {
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  completeButton: {
    backgroundColor: `${colors.success}15`,
  },
  completeText: {
    color: colors.success,
  },
  cancelButton: {
    backgroundColor: `${colors.danger}15`,
  },
  cancelText: {
    color: colors.danger,
  },
  deleteButton: {
    backgroundColor: `${colors.danger}15`,
  },
  deleteText: {
    color: colors.danger,
  },
});
