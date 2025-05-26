import { useState, useCallback } from 'react';

export const useAlert = () => {
  const [alert, setAlert] = useState({ type: null, message: null });

  const showMessage = useCallback((type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: null, message: null });
    }, 3000);
  }, []);

  return [alert, showMessage];
};
