import { h } from 'preact';
import { useState, useEffect, useMemo } from 'preact/hooks';
import { useServerData } from './hooks/useServerData';
import Navigation from './components/Navigation';
import MainDashboard from './components/MainDashboard';
import IndividualDashboard from './components/IndividualDashboard';
import Analytics from './components/Analytics';
import CalendarView from './components/CalendarView';
import CreateTask from './components/CreateTask';
import Login from './components/Login';
import { generateTaskInstances } from './utils/tasks';
import { getTodayString, getLocalDateString, addDays } from './utils/dates';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null); // Track who is logged in
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  useEffect(() => {
    const validateAuth = async () => {
      const authData = localStorage.getItem('kontrakan-auth');
      if (authData) {
        try {
          const { token } = JSON.parse(authData);
          
          const response = await fetch('/api/auth/validate', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (data.authenticated) {
            setIsAuthenticated(true);
            setLoggedInUser(data.user);
            if (data.user) {
              setCurrentUser(data.user);
              setCurrentView('individual');
            }
          } else {
            // Clear invalid auth data
            localStorage.removeItem('kontrakan-auth');
          }
        } catch (error) {
          console.error('Error validating authentication:', error);
          localStorage.removeItem('kontrakan-auth');
        }
      }
      setIsAuthLoading(false);
    };
    
    validateAuth();
  }, []);
  
  const {
    tasks, setTasks,
    checkIns, setCheckIns,
    scores, setScores,
    loading, error
  } = useServerData();

  const houseMembers = ['Ra\'if', 'Reza', 'Yayat', 'Iza', 'Zaki'];

  const taskInstances = useMemo(() => generateTaskInstances(tasks || []), [tasks]);

  const getTodayTasks = () => {
    const today = getTodayString();
    return taskInstances.filter(t => t.instanceDate === today);
  };

  const getWeekTasks = (userName) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekTasks = [];
    
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dateStr = getLocalDateString(date);
      
      const dayTasks = taskInstances.filter(t => 
        t.instanceDate === dateStr && 
        (t.type === 'individual' ? t.assignees?.includes(userName) : true)
      );
      
      weekTasks.push({
        date: dateStr,
        dayName: date.toLocaleDateString('id-ID', { weekday: 'short' }),
        tasks: dayTasks
      });
    }
    
    return weekTasks;
  };

  const completeTask = (taskId, instanceDate) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);

    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const completions = t.completions || {};
        completions[instanceDate] = true;
        return { ...t, completions };
      }
      return t;
    });
    setTasks(updatedTasks);

    const points = task.points || 10;
    const newScores = { ...scores };
    newScores.house += points;
    
    if (task.type === 'individual' && task.assignees) {
      task.assignees.forEach(assignee => {
        newScores.individuals[assignee] = (newScores.individuals[assignee] || 0) + points;
      });
    } else if (task.type === 'group' && task.assignees) {
      const pointsPerPerson = Math.floor(points / task.assignees.length);
      task.assignees.forEach(assignee => {
        newScores.individuals[assignee] = (newScores.individuals[assignee] || 0) + pointsPerPerson;
      });
    } else if (task.type === 'house') {
      const pointsPerPerson = Math.floor(points / houseMembers.length);
      houseMembers.forEach(member => {
        newScores.individuals[member] = (newScores.individuals[member] || 0) + pointsPerPerson;
      });
    }
    
    setScores(newScores);
  };

  const checkIn = (userName) => {
    // Only allow checking in for self
    if (userName !== loggedInUser) {
      console.error("Cannot check in for another user");
      return;
    }
    
    const today = getTodayString();
    setCheckIns({
      ...checkIns,
      [userName]: {
        ...checkIns[userName],
        [today]: true
      }
    });
  };

  const handleLogout = async () => {
    const authData = localStorage.getItem('kontrakan-auth');
    if (authData) {
      try {
        const { token } = JSON.parse(authData);
        
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    localStorage.removeItem('kontrakan-auth');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoggedInUser(null);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Memuat...</h2>
          <p>Mohon tunggu sementara kami memverifikasi autentikasi Anda</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={(user) => {
      setIsAuthenticated(true);
      setLoggedInUser(user);
      if (user) {
        setCurrentUser(user);
        setCurrentView('individual');
      }
    }} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Memuat...</h2>
          <p>Mohon tunggu sementara kami memuat data Anda</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">Kesalahan Memuat Data</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm text-gray-600">
            Pastikan server sedang berjalan dengan menjalankan: <br />
            <code className="bg-gray-100 px-2 py-1 rounded">node server.js</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        setCurrentUser={setCurrentUser}
        currentUser={currentUser}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />
      {currentView === 'dashboard' && !currentUser && (
        <MainDashboard
          getTodayTasks={getTodayTasks}
          showConfetti={showConfetti}
          scores={scores}
          houseMembers={houseMembers}
          checkIns={checkIns}
          checkIn={checkIn}
          setCurrentUser={setCurrentUser}
          setCurrentView={setCurrentView}
          completeTask={completeTask}
          loggedInUser={loggedInUser}
        />
      )}
      {currentView === 'individual' && currentUser && (
        <IndividualDashboard
          currentUser={currentUser}
          getTodayTasks={getTodayTasks}
          getWeekTasks={getWeekTasks}
          checkIns={checkIns}
          scores={scores}
          showConfetti={showConfetti}
          completeTask={completeTask}
          checkIn={checkIn}
          loggedInUser={loggedInUser}
        />
      )}
      {currentView === 'analytics' && (
        <Analytics
          taskInstances={taskInstances}
          scores={scores}
          houseMembers={houseMembers}
          checkIns={checkIns}
        />
      )}
      {currentView === 'calendar' && (
        <CalendarView
          taskInstances={taskInstances}
        />
      )}
      {currentView === 'create' && (
        <CreateTask
          setTasks={setTasks}
          setCurrentView={setCurrentView}
          tasks={tasks}
          houseMembers={houseMembers}
        />
      )}
    </div>
  );
};

export { App };