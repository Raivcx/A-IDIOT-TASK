import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Lock, Mail, Loader2, CheckSquare, X, CheckCircle2, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setError('As senhas não coincidem.');
          setLoading(false);
          return;
        }
        await register(email, password);
        // Clear fields immediately after success
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowVerifyModal(true);
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deepBlue flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-spaceGray border border-gray-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-neonCyan/20 flex items-center justify-center mb-4">
            <CheckSquare className="text-neonCyan" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">IDIOTask</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta no IDIOTask'}
          </p>
        </div>

        {error && (
          <div className={`p-3 rounded-lg text-sm mb-6 ${
            error.includes('sucesso') 
              ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-deepBlue border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neonCyan focus:ring-1 focus:ring-neonCyan transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-deepBlue border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neonCyan focus:ring-1 focus:ring-neonCyan transition-all"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-gray-400 mb-1">Confirmar Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-deepBlue border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neonCyan focus:ring-1 focus:ring-neonCyan transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neonCyan text-spaceGray font-bold rounded-lg px-4 py-3 mt-6 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>


        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-400 hover:text-neonCyan transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
          </button>
        </div>
      </div>
      </div>

      {/* Verification Sent Modal */}
      <AnimatePresence>
        {showVerifyModal && (
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
              <div className="w-20 h-20 bg-neonCyan/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Inbox className="text-neonCyan" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Verifique seu E-mail</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Enviamos um link de confirmação para o seu endereço de e-mail. Por favor, valide sua conta para continuar.
              </p>
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="w-full bg-neonCyan text-spaceGray font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all"
              >
                Entendi
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Login;
