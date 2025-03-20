import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [programs, setPrograms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState(''); // 'add' | 'edit'

  const fetchPrograms = async () => {
    const res = await axios.get(`${BACKEND_URL}/api/programs`);
    setPrograms(res.data);
  };

  const fetchFacilities = async () => {
    const res = await axios.get(`${BACKEND_URL}/api/facilities`);
    setFacilities(res.data);
  };

  // useEffect(() => {
  //   fetchPrograms();
  //   fetchFacilities();
  // }, []);

  return (
    <AdminContext.Provider
      value={{
        programs,
        facilities,
        fetchPrograms,
        fetchFacilities,
        selectedItem,
        setSelectedItem,
        actionType,
        setActionType
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);