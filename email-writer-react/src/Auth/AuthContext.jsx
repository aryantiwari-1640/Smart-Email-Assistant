import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt'));
  const [email, setEmail] = useState(() => localStorage.getItem('email'));

  const login = (jwt, userEmail) => {
    localStorage.setItem('jwt', jwt);
    localStorage.setItem('email', userEmail);
    setToken(jwt);
    setEmail(userEmail);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);