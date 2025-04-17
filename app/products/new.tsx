import React, { useState } from "react";
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
} from "react-native";
import { useProductStore } from "@/store/product-store";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { CategorySelector } from "@/components/CategorySelector";
// import { IconSelector } from "@/components/IconSelector";
import { useRouter, Stack } from "expo-router";
import { X } from "lucide-react-native";

export default function NewProductScreen() {
  const router = useRouter();
  const { addProduct } = useProductStore();
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  // const [icon, setIcon] = useState("cake");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Por favor, insira um nome para o produto");
      return;
    }

    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert("Erro", "Por favor, insira um preço válido");
      return;
    }

    if (!category.trim()) {
      Alert.alert("Erro", "Por favor, selecione uma categoria");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      addProduct({
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        category: category.trim(),
      });

      setLoading(false);
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Novo Produto",
        }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome do Produto</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome do produto"
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Preço</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="R$ 0,00"
                placeholderTextColor={colors.textLight}
                keyboardType="decimal-pad"
              />
            </View>

            <CategorySelector
              selectedCategory={category}
              onSelectCategory={(selectedCategory) => {
                setCategory(selectedCategory); // Atualiza a categoria selecionada
              }}
            />

            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrição (Opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Digite a descrição do produto"
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Salvar Produto"
            onPress={handleSave}
            loading={loading}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
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
    fontWeight: "500",
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
