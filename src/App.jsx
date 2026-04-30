import React, { useState, useContext, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import TaskList from './views/TaskList';
import Dashboard from './views/Dashboard';
import Calendar from './views/Calendar';
import Login from './views/Login';
import { TaskProvider } from './context/TaskContext';
import { AuthContext, AuthProvider } from './context/AuthContext';

function MainApp() {
  const { user } = useContext(AuthContext);
  const [currentView, setCurrentView] = useState('tasks');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Detect email confirmation from URL globally
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes('type=signup') || hash.includes('access_token='))) {
      setShowSuccessModal(true);
      // Clean URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  if (!user) {
    return <Login />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'analytics':
        return <Dashboard />;
      case 'calendar':
        return <Calendar />;
      case 'tasks':
      default:
        return <TaskList />;
    }
  };

  return (
    <TaskProvider>
      <div className="min-h-screen bg-deepBlue text-gray-200 pb-20 md:pb-0">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          {renderView()}
        </main>

        {/* Global Success Confirmation Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-spaceGray border border-gray-800 rounded-[2rem] p-10 text-center shadow-2xl"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-500" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">E-mail Validado!</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  Sua conta foi verificada com sucesso. Você já tem acesso total ao IDIOTask.
                </p>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-lg shadow-green-500/20"
                >
                  Continuar
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </TaskProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
