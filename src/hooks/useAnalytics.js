import { useMemo } from 'react';
import { format, subDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export const useAnalytics = (tasks) => {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, rate };
  }, [tasks]);

  const chartsData = useMemo(() => {
    // Last 7 days completion trend
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const completionTrend = last7Days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        name: format(date, 'EEE'),
        completed: tasks.filter((t) => t.completed && t.dueDate === dateStr).length,
      };
    });

    // Category Distribution
    const categories = ['Trabalho', 'Pessoal', 'Estudos'];
    const categoryData = categories.map((cat) => ({
      name: cat,
      value: tasks.filter((t) => t.category === cat).length,
    }));

    // Priority Distribution
    const priorities = ['Alta', 'Média', 'Baixa'];
    const priorityData = priorities.map((prio) => ({
      name: prio,
      value: tasks.filter((t) => t.priority === prio).length,
    }));

    return { completionTrend, categoryData, priorityData };
  }, [tasks]);

  const insights = useMemo(() => {
    const list = [];
    if (stats.total === 0) return ["Comece adicionando tarefas para ver insights!"];

    const mostFrequentCategory = [...chartsData.categoryData].sort((a, b) => b.value - a.value)[0];
    if (mostFrequentCategory?.value > 0) {
      list.push(`A maioria das suas tarefas são de ${mostFrequentCategory.name}.`);
    }

    const highPriorityCount = tasks.filter(t => t.priority === 'Alta').length;
    if (highPriorityCount > stats.total / 2) {
      list.push("Você tem muitas tarefas de Alta Prioridade pendentes.");
    }

    if (stats.rate > 80) {
      list.push("Sua taxa de conclusão está excelente hoje!");
    }

    return list;
  }, [tasks, stats, chartsData]);

  return { stats, chartsData, insights };
};
