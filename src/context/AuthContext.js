import React, { createContext, useState, useEffect, useContext } from 'react';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token){
      setUser({token})
    }
    setLoading(false)
    // const auth = getAuth();
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   setUser(user);
    //   setLoading(false);
    }, []);

  const login = async (email, password) =>{
    try{
      const response = await fetch('http://localhost:5000/login',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
      });
      const data = await response.json();
      if(data.token){
        localStorage.setItem('token', data.token);
        setUser({ token: data.token });
        return true;
      }
      return false;
    } catch(error){
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  }

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};