import React, { createContext, useState } from 'react';
import { json } from 'react-router-dom';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const initialUser = JSON.parse(localStorage.getItem("currentUser"))
  const [user, setUser] = useState(initialUser);

//   const updateUser = (name, value) => {
//     setUser({ ...user, [name]: value });
//   };

  const setCurrentUser = (user) => {
    setUser(user);
  };

  return (
    <UserContext.Provider value={{ user,  setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
