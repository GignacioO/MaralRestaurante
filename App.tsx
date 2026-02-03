
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import MenuSection from './components/MenuSection';
import ReviewsSection from './components/ReviewsSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminBar from './components/AdminBar';
import AdminFab from './components/AdminFab';
import AdminLoginModal from './components/AdminLoginModal';
import { INITIAL_MENU, INITIAL_CONTENT, MenuCategory, APP_VERSION } from './constants';
import { AdminContext } from './context/AdminContext';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState(() => localStorage.getItem('maral_pass') || 'admin123');
  
  const [menu, setMenu] = useState<MenuCategory[]>(() => {
    const savedVersion = localStorage.getItem('maral_version');
    if (savedVersion !== APP_VERSION) {
      localStorage.removeItem('maral_menu');
      localStorage.removeItem('maral_content');
      return INITIAL_MENU;
    }
    const savedMenu = localStorage.getItem('maral_menu');
    return savedMenu ? JSON.parse(savedMenu) : INITIAL_MENU;
  });

  const [content, setContent] = useState(() => {
    const savedVersion = localStorage.getItem('maral_version');
    if (savedVersion !== APP_VERSION) {
      return INITIAL_CONTENT;
    }
    const savedContent = localStorage.getItem('maral_content');
    return savedContent ? JSON.parse(savedContent) : INITIAL_CONTENT;
  });

  const [past, setPast] = useState<MenuCategory[][]>([]);
  const [future, setFuture] = useState<MenuCategory[][]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === 'a') {
        setShowLoginModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      content, updateContent: (newC: any) => setContent(prev => ({...prev, ...newC}))
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
        <AdminFab />
        <AdminLoginModal />
      </div>
    </AdminContext.Provider>
  );
}

export default App;
