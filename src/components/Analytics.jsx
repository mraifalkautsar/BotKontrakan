import { h } from 'preact';
import { TrendingUp, AlertCircle, Clock } from 'lucide-preact';

const Analytics = ({
  taskInstances,
  scores,
  houseMembers,
  checkIns
}) => {
  const getMissedTasks = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const missed = [];
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(yesterday);
      checkDate.setDate(yesterday.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayTasks = taskInstances.filter(t => 
        t.instanceDate === dateStr && !t.completed
      );
      
      dayTasks.forEach(task => {
        missed.push({
          ...task,
          missedDate: dateStr
        });
      });
    }
    
    return missed;
  };

  const getMissedCheckIns = () => {
    const missed = [];
    const today = new Date();
    
    houseMembers.forEach(member => {
      for (let i = 1; i < 8; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (!checkIns[member]?.[dateStr]) {
          missed.push({
            member,
            date: dateStr
          });
        }
      }
    });
    
    return missed;
  };

  const missedTasks = getMissedTasks();
  const missedCheckIns = getMissedCheckIns();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Analitik</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Skor Individual
          </h3>
          <div className="space-y-3">
            {Object.entries(scores.individuals)
              .sort((a, b) => b[1] - a[1])
              .map(([name, score], idx) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {idx === 0 && <span className="text-2xl">🥇</span>}
                    {idx === 1 && <span className="text-2xl">🥈</span>}
                    {idx === 2 && <span className="text-2xl">🥉</span>}
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full"
                        style={{ width: `${Math.min((score / Math.max(...Object.values(scores.individuals))) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-purple-600">{score}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Tugas Terlewat Terbaru
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {missedTasks.slice(0, 10).map((task, idx) => (
              <div key={idx} className="text-sm p-2 bg-red-50 rounded">
                <div className="font-medium">{task.name}</div>
                <div className="text-xs text-gray-600">
                  {new Date(task.missedDate).toLocaleDateString()} • tugas {task.type === 'individual' ? 'individu' : task.type === 'group' ? 'grup' : 'rumah'}
                  {task.assignees && ` • ${task.assignees.join(', ')}`}
                </div>
              </div>
            ))}
            {missedTasks.length === 0 && (
              <div className="text-gray-500 text-center py-4">Tidak ada tugas terlewat!</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-yellow-500" />
          Absensi Terlewat (7 Hari Terakhir)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {missedCheckIns.map((checkIn, idx) => (
            <div key={idx} className="text-sm p-2 bg-yellow-50 rounded">
              <span className="font-medium">{checkIn.member}</span>
              <span className="text-gray-600 ml-2">
                {new Date(checkIn.date).toLocaleDateString()}
              </span>
            </div>
          ))}
          {missedCheckIns.length === 0 && (
            <div className="text-gray-500 col-span-3 text-center py-4">
              Semua anggota sudah absen!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;