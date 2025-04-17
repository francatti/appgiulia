import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/types";

interface ProductState {
  products: Product[];
  categories: string[]; // Array of category names
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (
    id: string,
    product: Partial<Omit<Product, "id" | "createdAt">>
  ) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  addCategory: (category: string) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: ["Bolos", "Tortas", "Doces", "Cupcakes"], // Categorias padrão

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: Date.now().toString(),
          createdAt: Date.now(),
        };

        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },

      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, ...updatedProduct } : product
          ),
        }));
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
        }));
      },

      getProductById: (id) => {
        return get().products.find((product) => product.id === id);
      },
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
