
import { createContext } from 'react';
import { MenuCategory } from '../constants';

export interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  showLoginModal: boolean;
  setShowLoginModal: (val: boolean) => void;
  menu: MenuCategory[];
  updateMenu: (newMenu: MenuCategory[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  password: string;
  updatePassword: (newPass: string) => void;
  content: {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutDesc1: string;
    aboutDesc2: string;
  };
  updateContent: (newContent: any) => void;
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined);
