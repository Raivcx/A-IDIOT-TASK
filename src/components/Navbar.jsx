import React, { useContext } from 'react';
import { CheckSquare, BarChart2, Calendar as CalendarIcon, LogOut, Bell, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Navbar = ({ currentView, setCurrentView }) => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { id: 'tasks', label: 'Tarefas', icon: <CheckSquare size={20} /> },
    { id: 'analytics', label: 'Análises', icon: <BarChart2 size={20} /> },
    { id: 'calendar', label: 'Calendário', icon: <CalendarIcon size={20} /> },
  ];

  return (
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

        {/* User Actions */}
        <div className="flex items-center gap-6">
          <button className="relative p-3 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-2xl border border-white/5">
            <Bell size={20} />
            {user && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent-purple rounded-full border-2 border-[#0a0b10] animate-pulse"></span>
            )}
          </button>
          
          <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-white/10">
            <div className="text-right hidden lg:block">
              <p className="text-xs font-black text-white uppercase tracking-widest">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] font-bold text-gray-500">Pro Member</p>
            </div>
            <button 
              onClick={logout}
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
