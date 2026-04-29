import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

const SubtaskList = ({ subtasks = [], onUpdate }) => {
  const [newSubtask, setNewSubtask] = useState('');

  const toggleSubtask = (id) => {
    const updated = subtasks.map(s => s.id === id ? { ...s, completed: !s.completed } : s);
    onUpdate(updated);
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const updated = [...subtasks, { id: Date.now(), text: newSubtask, completed: false }];
    onUpdate(updated);
    setNewSubtask('');
  };

  const deleteSubtask = (id) => {
    const updated = subtasks.filter(s => s.id !== id);
    onUpdate(updated);
  };

  return (
    <div className="mt-4 space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Adicionar subtask..."
          className="flex-1 bg-deepBlue border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-neonCyan"
          onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
        />
        <button 
          onClick={addSubtask}
          className="p-1.5 bg-neonCyan/10 text-neonCyan rounded-lg hover:bg-neonCyan/20"
        >
          <Plus size={16} />
        </button>
      </div>
      
      {subtasks.map(s => (
        <div key={s.id} className="flex items-center justify-between group py-1">
          <button 
            onClick={() => toggleSubtask(s.id)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            {s.completed ? <CheckSquare size={14} className="text-neonCyan" /> : <Square size={14} />}
            <span className={s.completed ? 'line-through text-gray-600' : ''}>{s.text}</span>
          </button>
          <button 
            onClick={() => deleteSubtask(s.id)}
            className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-opacity"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubtaskList;
