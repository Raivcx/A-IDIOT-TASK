import React, { useState, useContext } from 'react';
import { PlusCircle, Calendar, Tag, AlignLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskContext } from '../context/TaskContext';
import { motion, AnimatePresence } from 'framer-motion';

const TaskForm = () => {
  const { addTask } = useContext(TaskContext);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Trabalho');
  const [priority, setPriority] = useState('Média');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    addTask({
      title,
      description,
      category,
      priority,
      dueDate,
      subtasks: [],
      tags: []
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setIsOpen(false);
  };

  return (
    <div className="bg-spaceGray rounded-2xl border border-gray-800 shadow-xl overflow-hidden transition-all duration-300 focus-within:border-neonCyan/50">
      <form onSubmit={handleSubmit}>
        <div className="p-4 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-3">
            <PlusCircle className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Adicionar nova tarefa..."
              value={title}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {!isOpen && (
              <button 
                type="button" 
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronDown size={18} />
              </button>
            )}
            <button
              type="submit"
              disabled={!title.trim() || !dueDate}
              className="bg-neonCyan text-spaceGray px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-opacity-90 disabled:opacity-30 disabled:grayscale transition-all"
            >
              Salvar
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-gray-800 bg-deepBlue/30"
            >
              <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-12">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <AlignLeft size={12} /> Descrição
                  </div>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicione detalhes..."
                    className="w-full bg-deepBlue border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-neonCyan transition-all min-h-[100px]"
                  />
                </div>

                <div className="md:col-span-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <Tag size={12} /> Categoria
                  </div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-deepBlue border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-neonCyan transition-all appearance-none cursor-pointer"
                  >
                    <option value="Trabalho">Trabalho</option>
                    <option value="Pessoal">Pessoal</option>
                    <option value="Estudos">Estudos</option>
                  </select>
                </div>

                <div className="md:col-span-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <AlignLeft size={12} /> Prioridade
                  </div>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-deepBlue border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-neonCyan transition-all appearance-none cursor-pointer"
                  >
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                  </select>
                </div>

                <div className="md:col-span-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <Calendar size={12} /> Data de Entrega
                  </div>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-deepBlue border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-neonCyan transition-all"
                  />
                </div>

                <div className="md:col-span-12 flex justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default TaskForm;
