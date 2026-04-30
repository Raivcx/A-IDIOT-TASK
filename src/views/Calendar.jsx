import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
  isPast, isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, Zap, 
  X, CheckCircle2, Clock, BarChart3, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const priorityColors = {
  Alta: 'bg-red-500',
  Média: 'bg-yellow-500',
  Baixa: 'bg-green-500'
};

const Calendar = () => {
  const { tasks } = useContext(TaskContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const selectedDayTasks = selectedDay 
    ? tasks.filter(t => t.dueDate === format(selectedDay, 'yyyy-MM-dd'))
    : [];

  const completionRate = selectedDayTasks.length > 0
    ? Math.round((selectedDayTasks.filter(t => t.completed).length / selectedDayTasks.length) * 100)
    : 0;

  return (
    <div className="space-y-10 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="px-3 py-1 bg-accent-blue/20 border border-accent-blue/30 rounded-full text-[10px] font-black uppercase tracking-widest text-accent-blue w-fit">
            Planejamento Mensal
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight capitalize">
            {format(currentDate, 'MMMM', { locale: ptBR })} <span className="text-gray-600">{format(currentDate, 'yyyy')}</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/5">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-3 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="px-8 py-2 text-sm font-black uppercase tracking-widest text-white hover:text-accent-blue transition-colors">
            Hoje
          </button>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-3 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all">
            <ChevronRight size={24} />
          </button>
        </div>
      </header>

      <div className="glass-card premium-border rounded-[3rem] overflow-hidden shadow-2xl neon-box-glow">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-white/5 border-b border-white/5">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="py-6 text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-white/5 border-l border-t border-white/5">
          {days.map((day, idx) => {
            const dayTasks = tasks.filter(t => t.dueDate === format(day, 'yyyy-MM-dd'));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isDayToday = isToday(day);

            return (
              <motion.div 
                key={idx} 
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => isCurrentMonth && setSelectedDay(day)}
                className={`min-h-[160px] p-4 transition-all relative group cursor-pointer ${!isCurrentMonth ? 'opacity-20 pointer-events-none' : ''}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`flex items-center justify-center w-10 h-10 text-lg font-black rounded-2xl transition-all ${
                    isDayToday ? 'bg-accent-blue text-black shadow-lg shadow-accent-blue/30 scale-110' : 'text-gray-500 group-hover:text-white'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex -space-x-1">
                      {dayTasks.slice(0, 3).map((t, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full border-2 border-[#12131a] ${priorityColors[t.priority]}`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {dayTasks.slice(0, 2).map(task => (
                    <motion.div 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={task.id}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold truncate border transition-all ${
                        task.completed 
                          ? 'bg-white/5 text-gray-600 border-transparent' 
                          : 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue hover:bg-accent-blue/20'
                      }`}
                    >
                      {task.title}
                    </motion.div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[10px] text-gray-600 font-black pl-2 flex items-center gap-1">
                      <Zap size={10} /> + {dayTasks.length - 2} mais
                    </div>
                  )}
                </div>
                
                {isDayToday && (
                  <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-accent-blue rounded-full animate-ping" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Side Detail Panel */}
      <AnimatePresence>
        {selectedDay && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDay(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0d0e14] border-l border-white/10 z-[70] shadow-2xl p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-accent-blue uppercase tracking-widest">Detalhes do Dia</p>
                  <h2 className="text-3xl font-black text-white capitalize">
                    {format(selectedDay, "eeee, d", { locale: ptBR })}
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Day Stats */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Total</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-white leading-none">{selectedDayTasks.length}</span>
                    <span className="text-xs font-bold text-gray-600 mb-1">tasks</span>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Progresso</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-accent-blue leading-none">{completionRate}%</span>
                    <BarChart3 size={16} className="text-accent-blue mb-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest pl-2">Lista de Tarefas</h3>
                
                {selectedDayTasks.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDayTasks.map(task => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={task.id}
                        className="group flex items-center gap-4 p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-3xl transition-all"
                      >
                        <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority] || 'bg-gray-500'} shadow-lg`} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${task.completed ? 'text-gray-600 line-through' : 'text-white'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-gray-600 flex items-center gap-1">
                              <Clock size={10} /> {task.priority}
                            </span>
                          </div>
                        </div>
                        {task.completed ? (
                          <CheckCircle2 className="text-accent-blue" size={20} />
                        ) : (
                          <ArrowRight className="text-gray-700 group-hover:text-white transition-colors" size={18} />
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <CalendarIcon className="text-gray-700" size={32} />
                    </div>
                    <p className="text-gray-500 font-bold text-sm">Nenhuma tarefa para este dia.</p>
                  </div>
                )}
              </div>

              <div className="mt-12 p-8 bg-gradient-to-br from-accent-blue/10 to-transparent border border-accent-blue/20 rounded-[3rem]">
                <p className="text-xs font-black text-accent-blue uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Zap size={14} /> Insight do Dia
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {selectedDayTasks.length > 3 
                    ? "Dia produtivo detectado! Priorize as tarefas de alta prioridade primeiro."
                    : selectedDayTasks.length === 0 
                    ? "Dia livre para planejamento ou descanso. Aproveite para organizar a próxima semana!"
                    : "Mantenha o foco. Poucas tarefas garantem maior qualidade na entrega."}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
