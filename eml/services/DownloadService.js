// IconContext.js
import React, { createContext, useState } from 'react';

export const IconContext = createContext();

export const IconProvider = ({ children }) => {
  const [iconState, setIconState] = useState({}); // Store icons for each course or card

  const updateIcon = (courseId, icon) => {
    setIconState(prevState => ({
      ...prevState,
      [courseId]: icon,
    }));
  };

  return (
    <IconContext.Provider value={{ iconState, updateIcon }}>
      {children}
    </IconContext.Provider>
  );
};
