import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { productIcons } from "@/constants/icons";
import { colors } from "@/constants/colors";
import * as Icons from "lucide-react-native";

interface IconSelectorProps {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onSelectIcon,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectIcon = (icon: string) => {
    console.log("Ícone selecionado:", icon); // Verifica se o ícone está sendo passado corretamente
    onSelectIcon(icon); // Atualiza o estado no componente pai
    setModalVisible(false); // Fecha o modal
  };

  const renderIcon = (iconName: string) => {
    try {
      // Converte camelCase para PascalCase
      const pascalCaseName =
        iconName.charAt(0).toUpperCase() + iconName.slice(1);
      const IconComponent = Icons[pascalCaseName];
      return IconComponent ? (
        <IconComponent size={24} color={colors.text} />
      ) : (
        <Icons.HelpCircle size={24} color={colors.text} />
      );
    } catch (error) {
      return <Icons.HelpCircle size={24} color={colors.text} />;
    }
  };

  // Converte camelCase para PascalCase para o ícone selecionado
  const pascalCaseSelectedIcon =
    selectedIcon.charAt(0).toUpperCase() + selectedIcon.slice(1);

  // @ts-ignore - dynamic icon import
  const SelectedIcon = Icons[pascalCaseSelectedIcon] || Icons.HelpCircle;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ícone</Text>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <SelectedIcon size={24} color={colors.text} />
        <Text style={styles.iconName}>{selectedIcon}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione um Ícone</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <Icons.X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.iconList}>
              <View style={styles.iconsGrid}>
                {productIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconItem,
                      selectedIcon === icon && styles.selectedIconItem,
                    ]}
                    onPress={() => {
                      handleSelectIcon(icon);
                    }}
                  >
                    {renderIcon(icon)}
                    <Text style={styles.iconItemText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <Pressable
            style={styles.modalOverlay}
            onPress={() => setModalVisible(false)}
            pointerEvents="box-none" // Permite que os toques passem para os elementos abaixo
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: colors.text,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  iconName: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
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
  iconList: {
    maxHeight: 400,
  },
  iconsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  iconItem: {
    width: "30%",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: colors.card,
    zIndex: 1, // Garante que o botão esteja acima de outros elementos
    elevation: 2, // Para Android, eleva o botão acima de outros elementos
  },
  selectedIconItem: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  iconItemText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textLight,
    textAlign: "center",
  },
});
