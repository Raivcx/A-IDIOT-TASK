import React, { useContext, useState, useRef, useEffect } from 'react';
import { 
  CheckSquare, BarChart2, Calendar as CalendarIcon, LogOut, Bell, User, 
  Settings, UserCircle, Image as ImageIcon, X, ChevronDown, Sparkles
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const Navbar = ({ currentView, setCurrentView }) => {
  const { user, logout, updateProfile, uploadAvatar } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (showEditModal) {
      setNewName(user?.user_metadata?.display_name || user?.email?.split('@')[0] || '');
      setAvatarUrl(user?.user_metadata?.avatar_url || '');
    }
  }, [showEditModal, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { id: 'tasks', label: 'Tarefas', icon: <CheckSquare size={20} /> },
    { id: 'analytics', label: 'Análises', icon: <BarChart2 size={20} /> },
    { id: 'calendar', label: 'Calendário', icon: <CalendarIcon size={20} /> },
  ];

  const userName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuário';

  const handleSaveProfile = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      await updateProfile({ 
        display_name: newName,
        avatar_url: avatarUrl 
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadAvatar(file);
      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Falha ao carregar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#0a0b10]/60 backdrop-blur-2xl border-b border-white/5 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple p-px">
              <div className="w-full h-full bg-[#0a0b10] rounded-[15px] flex items-center justify-center transition-all group-hover:bg-transparent">
                <CheckSquare className="text-white group-hover:scale-110 transition-transform" size={24} strokeWidth={3} />
              </div>
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">IDIOTask</span>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 p-1.5 rounded-[1.5rem] border border-white/5">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`relative flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  currentView === item.id 
                    ? 'text-white' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {currentView === item.id && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-white/10 rounded-2xl border border-white/10 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* User Actions & Profile */}
          <div className="flex items-center gap-4">
            <button className="relative p-3 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-2xl border border-white/5">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-accent-purple rounded-full border border-[#0a0b10] animate-pulse"></span>
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-white" size={20} />
                  )}
                </div>
                <div className="hidden lg:block text-left mr-2">
                  <p className="text-xs font-black text-white uppercase tracking-wider leading-none mb-1">{userName}</p>
                  <div className="flex items-center gap-1">
                    <Sparkles size={10} className="text-accent-blue" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Premium</span>
                  </div>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-64 bg-[#12131a] border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
                  >
                    <div className="p-6 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Logado como</p>
                      <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                    </div>

                    <div className="p-3">
                      <button 
                        onClick={() => { setShowEditModal(true); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <UserCircle size={18} /> Editar Perfil
                      </button>
                      <button 
                        onClick={() => { setShowEditModal(true); setShowDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <ImageIcon size={18} /> Alterar Foto
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <Settings size={18} /> Configurações
                      </button>
                    </div>

                    <div className="p-3 bg-white/[0.02]">
                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-black text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <LogOut size={18} /> Sair da conta
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#12131a] border border-white/10 rounded-[3rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-accent-blue/10 blur-[60px] rounded-full" />
              
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white tracking-tight">Editar Perfil</h2>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex flex-col items-center gap-4 mb-8">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-accent-blue to-accent-purple p-1 shadow-2xl overflow-hidden relative group">
                    <div className="w-full h-full bg-[#12131a] rounded-[1.8rem] flex items-center justify-center overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-white" size={40} />
                      )}
                    </div>
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <Loader2 className="text-white animate-spin" size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="text-xs font-black text-accent-blue uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Carregar Arquivo
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">URL da Imagem de Perfil</label>
                  <input 
                    type="text" 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-2">Nome de Exibição</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-sm text-gray-400 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    disabled={isSaving}
                    onClick={handleSaveProfile}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-purple rounded-2xl font-bold text-sm text-white shadow-xl shadow-accent-blue/20 transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
