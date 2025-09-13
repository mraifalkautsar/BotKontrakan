import { h } from 'preact';
import { CheckCircle, Circle, Users, User, Home, Award } from 'lucide-preact';
import { getTodayString } from '../utils/dates';

const MainDashboard = ({ 
  getTodayTasks, 
  showConfetti, 
  scores,
  houseMembers,
  setCurrentUser,
  setCurrentView,
  completeTask 
}) => {
  const todayTasks = getTodayTasks();
  const today = getTodayString();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}
      
      <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Skor Rumah</h2>
            <div className="flex items-center space-x-2">
              <Award className="w-8 h-8" />
              <span className="text-5xl font-bold">{scores.house}</span>
              <span className="text-xl">poin</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg mb-2">Kemajuan Hari Ini</div>
            <div className="text-3xl font-bold">
              {todayTasks.filter(t => t.completed).length} / {todayTasks.length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {houseMembers.map(member => (
          <button
            key={member}
            onClick={() => {
              setCurrentUser(member);
              setCurrentView('individual');
            }}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-blue-500" />
                <span className="font-semibold text-lg">{member}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Skor</div>
                <div className="text-xl font-bold text-purple-600">
                  {scores.individuals[member] || 0}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <h3 className="text-2xl font-bold mb-4">Tugas Hari Ini</h3>
      <div className="space-y-3">
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
                      {task.type === 'individual' && <User className="w-4 h-4 inline mr-1" />}
                      {task.type === 'group' && <Users className="w-4 h-4 inline mr-1" />}
                      {task.type === 'house' && <Home className="w-4 h-4 inline mr-1" />}
                      tugas {task.type === 'individual' ? 'individu' : task.type === 'group' ? 'grup' : 'rumah'}
                      {task.assignees && ` • ${task.assignees.join(', ')}`}
                      <span className="ml-2 text-purple-600 font-semibold">
                        +{task.points || 10} poin
                      </span>
                    </div>
                  </div>
                </div>
                {!task.completed && (task.type === 'group' || task.type === 'house') && (
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
    </div>
  );
};

export default MainDashboard;