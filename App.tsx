
import React, { useState, useEffect, createContext } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import ReviewsSection from './components/ReviewsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { INITIAL_MENU, MenuCategory, APP_VERSION } from './constants';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
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
  const [password, setPassword] = useState(() => {
    return localStorage.getItem('maral_pass') || 'admin123';
  });
  
  const [menu, setMenu] = useState<MenuCategory[]>(() => {
    const savedVersion = localStorage.getItem('maral_version');
    const savedMenu = localStorage.getItem('maral_menu');
    
    // Si la versión guardada es distinta a la del código, forzamos el menú inicial
    if (savedVersion !== APP_VERSION) {
      return INITIAL_MENU;
    }
    return savedMenu ? JSON.parse(savedMenu) : INITIAL_MENU;
  });

  const [content, setContent] = useState(() => {
    const savedVersion = localStorage.getItem('maral_version');
    const savedContent = localStorage.getItem('maral_content');
    
    if (savedVersion !== APP_VERSION) {
      return DEFAULT_CONTENT;
    }
    return savedContent ? JSON.parse(savedContent) : DEFAULT_CONTENT;
  });

  // History state for Undo/Redo
  const [past, setPast] = useState<MenuCategory[][]>([]);
  const [future, setFuture] = useState<MenuCategory[][]>([]);

  useEffect(() => {
    localStorage.setItem('maral_menu', JSON.stringify(menu));
    localStorage.setItem('maral_version', APP_VERSION);
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('maral_content', JSON.stringify(content));
    localStorage.setItem('maral_version', APP_VERSION);
  }, [content]);

  useEffect(() => {
    localStorage.setItem('maral_pass', password);
  }, [password]);

  const updateMenu = (newMenu: MenuCategory[]) => {
    setPast(prev => [...prev, menu]);
    setFuture([]); 
    setMenu(newMenu);
  };

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture(prev => [menu, ...prev]);
    setPast(newPast);
    setMenu(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast(prev => [...prev, menu]);
    setFuture(newFuture);
    setMenu(next);
  };

  const updatePassword = (newPass: string) => setPassword(newPass);
  const updateContent = (newContent: any) => setContent({ ...content, ...newContent });

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      setIsAdmin, 
      menu, 
      updateMenu, 
      undo,
      redo,
      canUndo: past.length > 0,
      canRedo: future.length > 0,
      password, 
      updatePassword,
      content,
      updateContent
    }}>
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main>
          <Hero />
          <About />
          <MenuSection />
          <ReviewsSection />
          <Contact />
        </main>
        <Footer />
      </div>
    </AdminContext.Provider>
  );
}

export default App;
