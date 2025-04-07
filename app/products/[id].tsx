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
  Alert
} from 'react-native';
import { useProductStore } from '@/store/product-store';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { IconSelector } from '@/components/IconSelector';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { Trash2, X } from 'lucide-react-native';

export default function EditProductScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getProductById, updateProduct, deleteProduct } = useProductStore();
  
  const product = getProductById(id as string);
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('cake');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setDescription(product.description);
      setIcon(product.icon);
    } else {
      // Product not found, go back
      Alert.alert('Erro', 'Produto não encontrado');
      router.back();
    }
  }, [product]);
  
  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira um nome para o produto');
      return;
    }
    
    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Erro', 'Por favor, insira um preço válido');
      return;
    }
    
    setLoading(true);
    
    // Simulate a delay
    setTimeout(() => {
      updateProduct(id as string, {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim(),
        icon,
      });
      
      setLoading(false);
      router.back();
    }, 500);
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Excluir Produto',
      'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteProduct(id as string);
            router.back();
          },
        },
      ]
    );
  };

  if (!product) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Editar Produto',
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
                placeholder="0,00"
                placeholderTextColor={colors.textLight}
                keyboardType="decimal-pad"
              />
            </View>
            
            <IconSelector
              selectedIcon={icon}
              onSelectIcon={setIcon}
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
            title="Excluir Produto"
            onPress={handleDelete}
            variant="danger"
            icon={<Trash2 size={18} color="white" />}
            style={styles.deleteButton}
          />
          
          <Button
            title="Salvar Alterações"
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
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
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    flexDirection: 'row',
  },
  deleteButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 2,
    marginLeft: 8,
  },
});