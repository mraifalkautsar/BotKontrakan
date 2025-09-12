import { h } from 'preact';
import { useState } from 'preact/hooks';

const CalendarView = ({ taskInstances }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const getTasksForDay = (day) => {
    if (!day) return [];
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    return taskInstances.filter(t => t.instanceDate === dateStr);
  };

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Kalender</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              const prev = new Date(currentMonth);
              prev.setMonth(prev.getMonth() - 1);
              setCurrentMonth(prev);
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            ←
          </button>
          <span className="text-xl font-semibold">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => {
              const next = new Date(currentMonth);
              next.setMonth(next.getMonth() + 1);
              setCurrentMonth(next);
            }}
            className="p-2 hover:bg-gray-100 rounded"
          >
            →
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-7 gap-2">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
          {getDaysInMonth().map((day, idx) => {
            const tasks = getTasksForDay(day);
            const date = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toISOString().split('T')[0] : null;
            const isToday = date === todayStr;
            const isPast = date && date < todayStr;
            
            return (
              <div
                key={idx}
                className={`min-h-24 p-2 border rounded-lg ${
                  !day ? 'bg-gray-50' : 
                  isToday ? 'bg-blue-50 border-blue-500' : 
                  'bg-white hover:bg-gray-50'
                }`}
              >
                {day && (
                  <>
                    <div className={`font-semibold mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {tasks.slice(0, 3).map(task => {
                        let colorClass = 'bg-gray-200';
                        if (task.completed) {
                          colorClass = 'bg-green-200';
                        } else if (isPast) {
                          colorClass = 'bg-red-200';
                        } else if (isToday) {
                          colorClass = 'bg-yellow-200';
                        }
                        
                        return (
                          <div
                            key={task.instanceId}
                            className={`text-xs p-1 rounded ${colorClass} truncate`}
                            title={task.name}
                          >
                            {task.name}
                          </div>
                        );
                      })}
                      {tasks.length > 3 && (
                        <div className="text-xs text-gray-500">+{tasks.length - 3} lagi</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex space-x-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span>Selesai</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span>Hari Ini (Menunggu)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Mendatang</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span>Terlewat</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;