import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  isMobile: boolean;
  
  // Actions
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
  updateMobileStatus: (status: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  isMobileOpen: false,
  isHovered: false,
  activeItem: null,
  openSubmenu: null,
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,

  toggleSidebar: () => set((state) => ({ isExpanded: !state.isExpanded })),
  
  toggleMobileSidebar: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  
  setIsHovered: (isHovered) => set({ isHovered }),
  
  setActiveItem: (item) => set({ activeItem: item }),
  
  toggleSubmenu: (item) => set((state) => ({ 
    openSubmenu: state.openSubmenu === item ? null : item 
  })),

  updateMobileStatus: (status) => set((state) => ({
    isMobile: status,
    // Nếu là mobile thì đóng sidebar mobile lại khi resize
    isMobileOpen: status ? state.isMobileOpen : false 
  })),
}));