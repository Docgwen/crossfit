import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_WODS, SAMPLE_PRS } from './sampleData';

const AppContext = createContext(null);

const WODS_KEY = '@crossfit_wods';
const PRS_KEY = '@crossfit_prs';

export function AppProvider({ children }) {
  const [wods, setWods] = useState(SAMPLE_WODS);
  const [prs, setPrs] = useState(SAMPLE_PRS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [storedWods, storedPrs] = await Promise.all([
          AsyncStorage.getItem(WODS_KEY),
          AsyncStorage.getItem(PRS_KEY),
        ]);
        if (storedWods) setWods(JSON.parse(storedWods));
        if (storedPrs) setPrs(JSON.parse(storedPrs));
      } catch (e) {
        // keep sample data on error
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const addWod = async (wod) => {
    const newWod = { ...wod, id: Date.now().toString() };
    const updated = [newWod, ...wods];
    setWods(updated);
    await AsyncStorage.setItem(WODS_KEY, JSON.stringify(updated)).catch(() => {});
    return newWod;
  };

  const addPR = async (pr) => {
    const newPR = { ...pr, id: Date.now().toString() };
    const updated = [newPR, ...prs];
    setPrs(updated);
    await AsyncStorage.setItem(PRS_KEY, JSON.stringify(updated)).catch(() => {});
    return newPR;
  };

  return (
    <AppContext.Provider value={{ wods, prs, addWod, addPR, loaded }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
