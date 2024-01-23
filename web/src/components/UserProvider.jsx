import React, { createContext, useState } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const initialUser = JSON.parse(localStorage.getItem("currentUser"))
  const [user, setUser] = useState(initialUser);
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
