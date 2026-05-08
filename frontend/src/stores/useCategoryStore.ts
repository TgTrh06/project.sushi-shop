import { create } from "zustand";
import { categoryService } from "@/features/categories/category.service";
import { showError } from "@/lib/toast";
import type { Category } from "@/features/categories/category.types";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  isInitialized: boolean;

  // Synchronous actions
  setCategories: (categories: Category[]) => void;
  setLoading: (status: boolean) => void;

  // Async actions
  fetchCategories: () => Promise<Category[]>;

  // Helpers/Selectors
  getCategoryById: (id: string) => Category | undefined;
  getCategoryName: (id: string) => string;

  refreshCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  isInitialized: false,

  setCategories: (categories) => set({ categories }),
  setLoading: (status: boolean) => set({ loading: status }),

  // Fetch categories from API, with caching to avoid redundant calls
  fetchCategories: async () => {
    // If already initialized and has categories, skip fetching
    if (get().isInitialized && get().categories.length > 0) {
      return get().categories;
    }

    try {
      set({ loading: true });
      const data = await categoryService.getCategories();
      set({ 
        categories: data, 
        isInitialized: true 
      });
      return data;
    } catch (error) {
      console.error("Fetch categories error:", error);
      showError("Failed to fetch categories.");
      return [];
    } finally {
      set({ loading: false });
    }
  },

  // Helper: Get category by ID
  getCategoryById: (id: string) => {
    return get().categories.find((c) => c.id === id);
  },

  // Helper: Get category name by ID, return default if not found
  getCategoryName: (id: string) => {
    const category = get().categories.find((c) => c.id === id);
    return category ? category.name : "Japanese Dish";
  },

  // Action để xóa cache và lấy dữ liệu mới
  refreshCategories: async () => {
    try {
      set({ loading: true });
      const data = await categoryService.getCategories();
      set({ 
        categories: data, 
        isInitialized: true 
      });
    } catch (error) {
      console.error("Fetch categories error:", error);
      showError("Failed to refresh categories.");
    } finally {
      set({ loading: false });
    }
  },
}));