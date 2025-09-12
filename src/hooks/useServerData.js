import { useState, useEffect } from 'preact/hooks';

const API_URL = 'http://localhost:3001/api';

export const useServerData = () => {
  const [data, setData] = useState({
    tasks: [],
    checkIns: {},
    scores: { house: 0, individuals: {} }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const serverData = await response.json();
        setData(serverData);
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Save data to server
  const saveData = async (newData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      
      if (!response.ok) throw new Error('Failed to save data');
      setData(newData);
    } catch (err) {
      setError(err.message);
      console.error('Error saving data:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper methods that maintain the data structure
  const setTasks = async (newTasks) => {
    const newData = { ...data, tasks: newTasks };
    await saveData(newData);
  };

  const setCheckIns = async (newCheckIns) => {
    const newData = { ...data, checkIns: newCheckIns };
    await saveData(newData);
  };

  const setScores = async (newScores) => {
    const newData = { ...data, scores: newScores };
    await saveData(newData);
  };

  return {
    tasks: data.tasks,
    setTasks,
    checkIns: data.checkIns,
    setCheckIns,
    scores: data.scores,
    setScores,
    loading,
    error
  };
};