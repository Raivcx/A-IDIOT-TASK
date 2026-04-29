import React, { useContext, useState } from 'react';
import { Calendar, Trash2, Check, ChevronDown, ChevronUp, Tag, AlertCircle, MoreHorizontal } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';
import SubtaskList from './SubtaskList';
import { isPast, isToday, parseISO } from 'date-fns';

const priorityConfig = {
  Alta: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', glow: 'shadow-red-400/20' },
  Média: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', glow: 'shadow-yellow-400/20' },
  Baixa: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', glow: 'shadow-green-400/20' }
};

const TaskItem = ({ task }) => {
  const { toggleTask, deleteTask, updateTask } = useContext(TaskContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !isToday(parseISO(task.dueDate)) && !task.completed;
  const config = priorityConfig[task.priority];

  const handleSaveTitle = () => {
    updateTask(task.id, { title: editedTitle });
    setIsEditing(false);
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -4 }}
      className={`glass-card premium-border rounded-3xl transition-all duration-500 overflow-hidden ${task.completed ? 'opacity-40 grayscale-[0.5]' : 'neon-box-glow'}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Checkbox */}
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => toggleTask(task.id)}
            className={`flex-shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
              task.completed 
                ? 'bg-accent-blue border-accent-blue text-black shadow-lg shadow-accent-blue/30' 
                : 'border-white/10 hover:border-accent-blue/50'
            }`}
          >
            {task.completed && <Check size={20} strokeWidth={4} />}
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <input 
                  autoFocus
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  className="bg-transparent border-b-2 border-accent-blue text-xl font-bold text-white w-full focus:outline-none py-1"
                />
              ) : (
                <h3 
                  onClick={() => setIsEditing(true)}
                  className={`text-xl font-bold truncate cursor-pointer transition-all hover:text-accent-blue ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}
                >
                  {task.title}
                </h3>
              )}
              {isOverdue && (
                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter bg-red-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-red-500/20">
                  <AlertCircle size={10} /> Atrasada
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                <Calendar size={14} className="text-accent-blue" />
                {task.dueDate || 'Sem prazo'}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${config.bg} ${config.color} ${config.border}`}>
                {task.priority}
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400 border border-white/5">
                {task.category}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-3 rounded-2xl transition-all ${isExpanded ? 'bg-accent-blue text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <div className="w-px h-8 bg-white/5 mx-1" />
            <button 
              onClick={() => deleteTask(task.id)}
              className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 mt-8 border-t border-white/5 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Descrição</label>
                  <p className="text-gray-300 font-medium leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                    {task.description || 'Nenhuma descrição detalhada fornecida.'}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Checklist de Subtarefas</label>
                    <span className="text-[10px] font-black text-accent-blue">{task.subtasks?.length || 0} Itens</span>
                  </div>
                  <SubtaskList 
                    subtasks={task.subtasks} 
                    onUpdate={(subtasks) => updateTask(task.id, { subtasks })}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TaskItem;
