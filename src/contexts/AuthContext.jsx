import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [token, setToken] = useState(null);

  const login = (username, password) => {
    const encodedLogin = Buffer.from(
      `${username}:${password}`,
      'utf-8'
    ).toString('base64');
    return encodedLogin;
  };

  const logout = () => {
    setIsSignedIn(false);
    setToken(null);

    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    isSignedIn,
    setIsSignedIn,
    token,
    setToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
