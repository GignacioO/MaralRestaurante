
import React, { useState, useEffect, createContext } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import ReviewsSection from './components/ReviewsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminBar from './components/AdminBar';
import AdminLoginModal from './components/AdminLoginModal';
import { INITIAL_MENU, MenuCategory, APP_VERSION } from './constants';

interface AdminContextType {
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

const DEFAULT_CONTENT = {
  heroTitle: "MARAL RESTAURANTE",
  heroSubtitle: "Sabor que trasciende, momentos que perduran en el corazón de Buenos Aires.",
  aboutTitle: "Calidad que define nuestra historia",
  aboutDesc1: "En Maral Restaurante, nos dedicamos a elevar la tradición culinaria porteña. Ubicados estratégicamente en el corazón de la ciudad, ofrecemos un refugio de sabor para aquellos que buscan una experiencia cuidada en cada detalle.",
  aboutDesc2: "Nuestra filosofía se basa en la selección rigurosa de ingredientes frescos y la pasión por el servicio. Ya sea para un desayuno tranquilo o una cena sofisticada, Maral es el punto de encuentro donde la calidad y la hospitalidad se unen."
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState(() => localStorage.getItem('maral_pass') || 'admin123');
  const [menu, setMenu] = useState<MenuCategory[]>(() => {
    const savedVersion = localStorage.getItem('maral_version');
    const savedMenu = localStorage.getItem('maral_menu');
    if (savedVersion !== APP_VERSION) return INITIAL_MENU;
    return savedMenu ? JSON.parse(savedMenu) : INITIAL_MENU;
  });
  const [content, setContent] = useState(() => {
    const savedVersion = localStorage.getItem('maral_version');
    const savedContent = localStorage.getItem('maral_content');
    if (savedVersion !== APP_VERSION) return DEFAULT_CONTENT;
    return savedContent ? JSON.parse(savedContent) : DEFAULT_CONTENT;
  });

  const [past, setPast] = useState<MenuCategory[][]>([]);
  const [future, setFuture] = useState<MenuCategory[][]>([]);

  useEffect(() => {
    localStorage.setItem('maral_menu', JSON.stringify(menu));
    localStorage.setItem('maral_content', JSON.stringify(content));
    localStorage.setItem('maral_version', APP_VERSION);
    localStorage.setItem('maral_pass', password);
  }, [menu, content, password]);

  const updateMenu = (newMenu: MenuCategory[]) => {
    setPast(prev => [...prev, menu]);
    setFuture([]); 
    setMenu(newMenu);
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setFuture(prev => [menu, ...prev]);
    setPast(past.slice(0, -1));
    setMenu(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setPast(prev => [...prev, menu]);
    setFuture(future.slice(1));
    setMenu(next);
  };

  return (
    <AdminContext.Provider value={{ 
      isAdmin, setIsAdmin, showLoginModal, setShowLoginModal,
      menu, updateMenu, undo, redo,
      canUndo: past.length > 0, canRedo: future.length > 0,
      password, updatePassword: setPassword,
      content, updateContent: (newC: any) => setContent({...content, ...newC})
    }}>
      <div className={`min-h-screen bg-zinc-950 text-zinc-100 ${isAdmin ? 'pt-12' : ''}`}>
        {isAdmin && <AdminBar />}
        <Navbar />
        <main>
          <Hero />
          <About />
          <MenuSection />
          <ReviewsSection />
          <Contact />
        </main>
        <Footer />
        <AdminLoginModal />
      </div>
    </AdminContext.Provider>
  );
}

export default App;
