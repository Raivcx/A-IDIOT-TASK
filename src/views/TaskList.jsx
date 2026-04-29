import React, { useState, useContext, useMemo } from 'react';
import TaskForm from '../components/TaskForm';
import FilterBar from '../components/FilterBar';
import TaskItem from '../components/TaskItem';
import { TaskContext } from '../context/TaskContext';
import { Loader2, Search, SlidersHorizontal, SortAsc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskList = () => {
  const { tasks, loadingTasks } = useContext(TaskContext);
  const [filter, setFilter] = useState('Todas');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'priority', 'category'

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks.filter(task => {
      // Status Filter
      if (filter === 'Pendentes' && task.completed) return false;
      if (filter === 'Concluídas' && !task.completed) return false;
      
      // Search Filter
      if (search && !task.title.toLowerCase().includes(search.toLowerCase())) return false;
      
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999');
      }
      if (sortBy === 'priority') {
        const order = { Alta: 0, Média: 1, Baixa: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [tasks, filter, search, sortBy]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Minhas Tarefas</h1>
          <p className="text-gray-400">Gerencie e organize suas prioridades do dia.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Pesquisar tarefas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-spaceGray border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neonCyan w-64"
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-spaceGray border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-400 focus:outline-none focus:border-neonCyan"
          >
            <option value="date">Data</option>
            <option value="priority">Prioridade</option>
            <option value="category">Categoria</option>
          </select>
        </div>
      </div>

      <TaskForm />
      
      <div className="flex flex-col gap-6">
        <FilterBar filter={filter} setFilter={setFilter} />

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {loadingTasks ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-neonCyan" size={32} />
              </div>
            ) : filteredAndSortedTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-spaceGray/50 rounded-3xl border border-dashed border-gray-800"
              >
                <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada.</p>
                <button 
                   onClick={() => {setFilter('Todas'); setSearch('');}}
                   className="mt-2 text-neonCyan text-sm hover:underline"
                >
                  Limpar filtros
                </button>
              </motion.div>
            ) : (
              filteredAndSortedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
