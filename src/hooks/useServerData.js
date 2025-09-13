import { useState, useEffect } from 'preact/hooks';


// Keknya json cukup buat app ini, sih, tapi masih mempertimbangkan make DB juga

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function useServerData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initial data fetch from server
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/data`);
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        
        const serverData = await response.json();
        setData(serverData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data from server:', err);
        setError(`Gagal terhubung ke server: ${err.message}. Menggunakan data lokal.`);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Save data to server
  const saveData = async (newData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      setData(newData);
      setError(null);
    } catch (err) {
      console.error('Failed to save data to server:', err);
      setError(`Gagal menyimpan ke server: ${err.message}. Data disimpan secara lokal.`);
      setData(newData);
    } finally {
      setLoading(false);
    }
  };
  
  // Provide specific setter functions to update different parts of the data
  const setTasks = (tasks) => {
    const newData = { ...data, tasks };
    saveData(newData);
  };
  
  const setCheckIns = (checkIns) => {
    const newData = { ...data, checkIns };
    saveData(newData);
  };
  
  const setScores = (scores) => {
    const newData = { ...data, scores };
    saveData(newData);
  };
  
  return {
    tasks: data?.tasks || [],
    checkIns: data?.checkIns || {},
    scores: data?.scores || { house: 0, individuals: {} },
    setTasks,
    setCheckIns,
    setScores,
    loading,
    error
  };
}