/**
 * Utility functions for task management
 */

// Generates recurring task instances based on configured task parameters
export const generateTaskInstances = (tasks) => {
  const instances = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  tasks.forEach(task => {
    if (!task.startDate) return;
    
    const startDate = new Date(task.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    // Generate instances for the next 60 days
    for (let d = 0; d < 60; d++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + d);
      
      if (checkDate < startDate) continue;
      
      let shouldInclude = false;
      const daysSinceStart = Math.floor((checkDate - startDate) / (1000 * 60 * 60 * 24));
      
      switch (task.recurrence) {
        case 'once':
          shouldInclude = checkDate.getTime() === startDate.getTime();
          break;
        case 'daily':
          shouldInclude = true;
          break;
        case 'weekly':
          shouldInclude = checkDate.getDay() === startDate.getDay();
          break;
        case 'custom-days':
          shouldInclude = daysSinceStart % task.customInterval === 0;
          break;
        case 'custom-weeks':
          shouldInclude = daysSinceStart % (task.customInterval * 7) === 0;
          break;
        case 'custom-months':
          const monthsDiff = (checkDate.getFullYear() - startDate.getFullYear()) * 12 + 
                           (checkDate.getMonth() - startDate.getMonth());
          shouldInclude = monthsDiff % task.customInterval === 0 && 
                        checkDate.getDate() === startDate.getDate();
          break;
      }
      
      if (shouldInclude) {
        instances.push({
          ...task,
          instanceDate: checkDate.toISOString().split('T')[0],
          instanceId: `${task.id}-${checkDate.toISOString().split('T')[0]}`,
          completed: task.completions?.[checkDate.toISOString().split('T')[0]] || false
        });
      }
    }
  });
  
  return instances;
};