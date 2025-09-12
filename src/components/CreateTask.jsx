import { h } from 'preact';
import { useState } from 'preact/hooks';

const CreateTask = ({ setTasks, setCurrentView, tasks, houseMembers }) => {
  const [newTask, setNewTask] = useState({
    name: '',
    type: 'individual',
    assignees: [],
    recurrence: 'once',
    customInterval: 1,
    startDate: new Date().toISOString().split('T')[0],
    points: 10
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTask.name) return;

    const task = {
      ...newTask,
      id: Date.now().toString(),
      completions: {}
    };

    if (task.type === 'house') {
      task.assignees = houseMembers;
    }

    setTasks([...tasks, task]);
    setNewTask({
      name: '',
      type: 'individual',
      assignees: [],
      recurrence: 'once',
      customInterval: 1,
      startDate: new Date().toISOString().split('T')[0],
      points: 10
    });
    setCurrentView('dashboard');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Buat Tugas Baru</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Tugas
          </label>
          <input
            type="text"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama tugas"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipe Tugas
          </label>
          <select
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value, assignees: [] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="individual">Individu</option>
            <option value="group">Grup</option>
            <option value="house">Seluruh Rumah</option>
          </select>
        </div>

        {(newTask.type === 'individual' || newTask.type === 'group') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ditugaskan Kepada
            </label>
            <div className="space-y-2">
              {houseMembers.map(member => (
                <label key={member} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newTask.assignees.includes(member)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewTask({ ...newTask, assignees: [...newTask.assignees, member] });
                      } else {
                        setNewTask({ ...newTask, assignees: newTask.assignees.filter(a => a !== member) });
                      }
                    }}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>{member}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pengulangan
          </label>
          <select
            value={newTask.recurrence}
            onChange={(e) => setNewTask({ ...newTask, recurrence: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="once">Sekali saja</option>
            <option value="daily">Setiap hari</option>
            <option value="weekly">Setiap minggu</option>
            <option value="custom-days">Setiap N hari</option>
            <option value="custom-weeks">Setiap N minggu</option>
            <option value="custom-months">Setiap N bulan</option>
          </select>
        </div>

        {newTask.recurrence.startsWith('custom-') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interval
            </label>
            <input
              type="number"
              min="1"
              value={newTask.customInterval}
              onChange={(e) => setNewTask({ ...newTask, customInterval: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Mulai
          </label>
          <input
            type="date"
            value={newTask.startDate}
            onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poin
          </label>
          <input
            type="number"
            min="1"
            value={newTask.points}
            onChange={(e) => setNewTask({ ...newTask, points: parseInt(e.target.value) || 10 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
          >
            Buat Tugas
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTask;