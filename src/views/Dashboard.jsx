import React, { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Clock, Target, Lightbulb, Zap, ArrowUpRight } from 'lucide-react';

const COLORS = ['#00d2ff', '#9d50bb', '#6ab0ff', '#f7768e', '#9ece6a'];

const KPICard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="glass-card premium-border p-8 rounded-[2rem] relative group"
  >
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon size={80} />
    </div>
    
    <div className="flex flex-col h-full relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${colorClass} shadow-lg`}>
        <Icon className="text-white" size={28} />
      </div>
      
      <div className="space-y-1">
        <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-widest">{title}</h3>
        <div className="flex items-baseline gap-3">
          <p className="text-5xl font-black text-white tracking-tighter">{value}</p>
          {trend && (
            <span className="flex items-center gap-0.5 text-xs font-black text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
              <ArrowUpRight size={14} /> {trend}%
            </span>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { tasks } = useContext(TaskContext);
  const { stats, chartsData, insights } = useAnalytics(tasks);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20 px-2"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="px-3 py-1 bg-accent-purple/20 border border-accent-purple/30 rounded-full text-[10px] font-black uppercase tracking-widest text-accent-purple">
              Análises em tempo real
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl font-black text-white tracking-tight leading-none">
            Visão <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple">Geral</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-400 text-lg max-w-xl font-medium">
            Monitoramento inteligente da sua carga de trabalho e métricas de eficiência.
          </motion.p>
        </div>
        
        <motion.div variants={itemVariants} className="flex gap-4">
           <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl font-bold text-sm transition-all">
             Exportar Relatório
           </button>
           <button className="bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-xl shadow-accent-blue/20 hover:shadow-accent-blue/40 transition-all">
             Gerar Insights AI
           </button>
        </motion.div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard title="Volume Total" value={stats.total} icon={TrendingUp} colorClass="from-accent-blue to-blue-600" />
        <KPICard title="Concluídas" value={stats.completed} icon={CheckCircle2} trend={14} colorClass="from-green-400 to-emerald-600" />
        <KPICard title="Backlog" value={stats.pending} icon={Clock} colorClass="from-orange-400 to-red-600" />
        <KPICard title="Eficiência" value={`${stats.rate}%`} icon={Target} colorClass="from-accent-purple to-pink-600" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Productivity Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2 glass-card premium-border p-8 rounded-[2.5rem] shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Fluxo de Produtividade</h3>
            <div className="flex gap-2">
              {['W', 'M', 'Y'].map(t => (
                <button key={t} className={`w-8 h-8 rounded-lg text-[10px] font-bold ${t === 'W' ? 'bg-accent-blue text-black' : 'bg-white/5 text-gray-500'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartsData.completionTrend}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d2ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={11} axisLine={false} tickLine={false} tickMargin={15} />
                <YAxis stroke="#4b5563" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#12131a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#00d2ff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#00d2ff" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorComp)" 
                  className="chart-glow-filter"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div variants={itemVariants} className="glass-card premium-border p-8 rounded-[2.5rem] shadow-2xl flex flex-col">
          <h3 className="text-2xl font-black text-white tracking-tight mb-10">Distribuição</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartsData.categoryData}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartsData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            {chartsData.categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-sm font-bold text-gray-400">{cat.name}</span>
                </div>
                <span className="text-sm font-black text-white">{cat.value} tarefas</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div variants={itemVariants} className="glass-card premium-border p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-accent-purple/10 blur-[100px] rounded-full" />
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-2xl shadow-yellow-500/20">
            <Zap className="text-white" size={40} />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-3xl font-black text-white tracking-tight">Otimize seu fluxo</h3>
            <p className="text-gray-400 font-medium text-lg">Baseado nos seus dados, aqui estão sugestões de alta performance.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 relative z-10">
          {insights.map((insight, idx) => (
            <motion.div 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              key={idx} 
              className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                <Lightbulb className="text-accent-blue" size={20} />
              </div>
              <p className="text-gray-300 font-bold leading-relaxed">{insight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
