import { getLocalDateString, parseLocalDate, addDays, isSameDay } from './dates';

/**
 * Yang beginian harusnya di server ...
 */

export const generateTaskInstances = (tasks) => {
  const instances = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  tasks.forEach(task => {
    if (!task.startDate) return;
    
    const startDate = parseLocalDate(task.startDate);
    if (!startDate) return;
    
    for (let d = 0; d < 60; d++) {
      const checkDate = addDays(today, d);
      
      if (checkDate < startDate) continue;
      
      let shouldInclude = false;
      const daysSinceStart = Math.floor((checkDate - startDate) / (1000 * 60 * 60 * 24));
      
      switch (task.recurrence) {
        case 'once':
          shouldInclude = isSameDay(checkDate, startDate);
          break;
        case 'daily':
          shouldInclude = true;
          break;
        case 'weekly':
          shouldInclude = checkDate.getDay() === startDate.getDay();
          break;
        case 'custom-days':
          shouldInclude = daysSinceStart % (task.customInterval || 1) === 0;
          break;
        case 'custom-weeks':
          shouldInclude = daysSinceStart % ((task.customInterval || 1) * 7) === 0;
          break;
        case 'custom-months': {
          const monthsDiff = (checkDate.getFullYear() - startDate.getFullYear()) * 12 + 
                           (checkDate.getMonth() - startDate.getMonth());
          shouldInclude = monthsDiff % (task.customInterval || 1) === 0 && 
                        checkDate.getDate() === startDate.getDate();
          break;
        }
      }
      
      if (shouldInclude) {
        const instanceDate = getLocalDateString(checkDate);
        instances.push({
          ...task,
          instanceDate,
          instanceId: `${task.id}-${instanceDate}`,
          completed: task.completions?.[instanceDate] || false
        });
      }
    }
  });
  
  return instances;
};