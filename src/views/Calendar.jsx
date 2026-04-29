import React, { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
  isPast, isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const priorityColors = {
  Alta: 'bg-red-500',
  Média: 'bg-yellow-500',
  Baixa: 'bg-green-500'
};

const Calendar = () => {
  const { tasks } = useContext(TaskContext);
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

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
                className={`min-h-[160px] p-4 transition-all relative group ${!isCurrentMonth ? 'opacity-20 pointer-events-none' : ''}`}
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
    </div>
  );
};

export default Calendar;
