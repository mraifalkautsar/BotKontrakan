import { h } from 'preact';
import { Home, BarChart3, CalendarDays, Plus } from 'lucide-preact';

const Navigation = ({ currentView, setCurrentView, setCurrentUser, currentUser }) => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-lg">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Home className="w-6 h-6" />
        <h1 className="text-2xl font-bold">SIK (Sistem Informasi Kontrakan)</h1>
      </div>
      <nav className="flex space-x-4">
        <button
          onClick={() => { setCurrentView('dashboard'); setCurrentUser(null); }}
          className={`px-4 py-2 rounded-lg transition-all text-white ${currentView === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <Home className="w-5 h-5 inline mr-2" />
          Utama
        </button>
        <button
          onClick={() => setCurrentView('analytics')}
          className={`px-4 py-2 rounded-lg transition-all text-white ${currentView === 'analytics' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <BarChart3 className="w-5 h-5 inline mr-2" />
          Analitik
        </button>
        <button
          onClick={() => setCurrentView('calendar')}
          className={`px-4 py-2 rounded-lg transition-all text-white ${currentView === 'calendar' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <CalendarDays className="w-5 h-5 inline mr-2" />
          Kalender
        </button>
        <button
          onClick={() => setCurrentView('create')}
          className={`px-4 py-2 rounded-lg transition-all text-white ${currentView === 'create' ? 'bg-white/20' : 'hover:bg-white/10'}`}
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Buat Tugas
        </button>
      </nav>
    </div>
    {currentUser && (
      <div className="max-w-7xl mx-auto mt-2 text-sm">
        Melihat: Dasbor {currentUser}
      </div>
    )}
  </div>
);

export default Navigation;