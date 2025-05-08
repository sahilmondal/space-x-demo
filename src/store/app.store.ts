import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  avatar?: string;
  email?: string;
  preferences?: {
    darkMode: boolean;
    favoriteRockets: string[];
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (
    username: string,
    password: string,
    remember?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUserPreferences: (preferences: Partial<User["preferences"]>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      login: async (username: string, password: string, remember = false) => {
        set({ isLoading: true, error: null });

        try {
          // Simple mock authentication
          if (username && password === "password") {
            set({
              isAuthenticated: true,
              isLoading: false,
              user: {
                username,
                avatar: `https://api.dicebear.com/9.x/pixel-art/svg`,
                email: `${username.toLowerCase()}@example.com`,
                preferences: {
                  darkMode: false,
                  favoriteRockets: [],
                },
              },
            });
            return true;
          }

          set({
            isLoading: false,
            error: "Invalid credentials. Try username: any, password: password",
          });
          return false;
        } catch (err) {
          set({ isLoading: false, error: "An error occurred during login" });
          return false;
        }
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
      clearError: () => {
        set({ error: null });
      },
      updateUserPreferences: (preferences) => {
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: {
                  ...(state.user.preferences as any),
                  ...preferences,
                },
              }
            : null,
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);

interface FilterState {
  searchTerm: string;
  sortBy: string;
  sortDirection: "asc" | "desc";
  viewMode: "table" | "grid";
  filters: {
    success: boolean | null;
    upcoming: boolean | null;
    year: number | null;
  };
  setSearchTerm: (term: string) => void;
  setSortBy: (field: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
  setViewMode: (mode: "table" | "grid") => void;
  setFilter: (key: keyof FilterState["filters"], value: any) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: "",
  sortBy: "date_utc",
  sortDirection: "desc",
  viewMode: "table",
  filters: {
    success: null,
    upcoming: null,
    year: null,
  },
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortBy: (field) => set({ sortBy: field }),
  setSortDirection: (direction) => set({ sortDirection: direction }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  resetFilters: () =>
    set({
      searchTerm: "",
      sortBy: "date_utc",
      sortDirection: "desc",
      filters: {
        success: null,
        upcoming: null,
        year: null,
      },
    }),
}));

interface UIState {
  colorScheme: "light" | "dark";
  toggleColorScheme: () => void;
  notifications: Array<{
    id: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
    timeout?: number;
  }>;
  addNotification: (
    notification: Omit<UIState["notifications"][0], "id">
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  colorScheme: "light",
  toggleColorScheme: () =>
    set((state) => ({
      colorScheme: state.colorScheme === "light" ? "dark" : "light",
    })),
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id: Math.random().toString(36).substring(2, 9),
          ...notification,
        },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));

interface FavoritesState {
  favoriteLaunches: string[];
  favoriteRockets: string[];
  addFavoriteLaunch: (id: string) => void;
  removeFavoriteLaunch: (id: string) => void;
  addFavoriteRocket: (id: string) => void;
  removeFavoriteRocket: (id: string) => void;
  isFavoriteLaunch: (id: string) => boolean;
  isFavoriteRocket: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteLaunches: [],
      favoriteRockets: [],
      addFavoriteLaunch: (id) =>
        set((state) => ({
          favoriteLaunches: [...state.favoriteLaunches, id],
        })),
      removeFavoriteLaunch: (id) =>
        set((state) => ({
          favoriteLaunches: state.favoriteLaunches.filter(
            (launchId) => launchId !== id
          ),
        })),
      addFavoriteRocket: (id) =>
        set((state) => ({
          favoriteRockets: [...state.favoriteRockets, id],
        })),
      removeFavoriteRocket: (id) =>
        set((state) => ({
          favoriteRockets: state.favoriteRockets.filter(
            (rocketId) => rocketId !== id
          ),
        })),
      isFavoriteLaunch: (id) => get().favoriteLaunches.includes(id),
      isFavoriteRocket: (id) => get().favoriteRockets.includes(id),
    }),
    {
      name: "favorites-storage",
    }
  )
);
