import { h } from 'preact';
import { CheckCircle, Circle, Clock, Star } from 'lucide-preact';
import { getTodayString, addDays, formatDate } from '../utils/dates';

const IndividualDashboard = ({
  currentUser,
  getTodayTasks,
  getWeekTasks,
  checkIns,
  scores,
  showConfetti,
  completeTask,
  checkIn
}) => {
  if (!currentUser) return null;
  
  const today = getTodayString();
  const hasCheckedIn = checkIns[currentUser]?.[today];
  const weekTasks = getWeekTasks(currentUser);
  const todayTasks = getTodayTasks().filter(t => 
    t.type === 'individual' ? t.assignees?.includes(currentUser) : true
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
      
      <div className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Dasbor {currentUser}</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6" />
                <span className="text-2xl font-bold">{scores.individuals[currentUser] || 0}</span>
                <span>poin</span>
              </div>
            </div>
          </div>
          <div>
            {!hasCheckedIn ? (
              <button
                onClick={() => checkIn(currentUser)}
                className="bg-green-500 text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                <Clock className="w-5 h-5 inline mr-2" />
                ABSEN
              </button>
            ) : (
              <div className="bg-white/20 px-6 py-3 rounded-lg">
                <CheckCircle className="w-5 h-5 inline mr-2" />
                Sudah Absen Hari Ini!
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Tugas Hari Ini</h3>
      <div className="space-y-3 mb-8">
        {todayTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">Tidak ada tugas hari ini!</div>
        ) : (
          todayTasks.map(task => (
            <div key={task.instanceId} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {task.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                  <div>
                    <div className="font-semibold">{task.name}</div>
                    <div className="text-sm text-gray-600">
                      tugas {task.type === 'individual' ? 'individu' : task.type === 'group' ? 'grup' : 'rumah'}
                      <span className="ml-2 text-purple-600 font-semibold">
                        +{task.points || 10} poin
                      </span>
                    </div>
                  </div>
                </div>
                {!task.completed && task.type === 'individual' && (
                  <button
                    onClick={() => completeTask(task.id, today)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                  >
                    Tugas Selesai
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="text-2xl font-bold mb-4">Minggu Depan</h3>
      <div className="grid grid-cols-7 gap-2">
        {weekTasks.map((day, idx) => (
          <div key={day.date} className={`bg-white p-3 rounded-lg shadow-md ${idx === 0 ? 'ring-2 ring-purple-500' : ''}`}>
            <div className="font-semibold text-center mb-2">{day.dayName}</div>
            <div className="text-xs text-center text-gray-500 mb-2">
              {formatDate(day.date, { day: 'numeric' })}
            </div>
            <div className="space-y-1">
              {day.tasks.map(task => (
                <div key={task.instanceId} className="text-xs p-1 bg-gray-100 rounded">
                  {task.name}
                </div>
              ))}
              {day.tasks.length === 0 && (
                <div className="text-xs text-gray-400 text-center">Kosong</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndividualDashboard;