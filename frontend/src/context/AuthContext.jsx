import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Mock Initial User (you can test with null later)
// roles: 'Admin', 'Manager', 'Developer'
const MOCK_USER = {
  id: 1,
  name: 'Alex Developer',
  email: 'alex@example.com',
  role: 'Developer'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token in a real app
    const storedUser = localStorage.getItem('pm_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login request
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const loggedInUser = { ...MOCK_USER, email };
          setUser(loggedInUser);
          localStorage.setItem('pm_user', JSON.stringify(loggedInUser));
          resolve(loggedInUser);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  };

  const register = async (name, email, password, role) => {
    try {
      // Direct REST call to the running user-service container
      const response = await fetch('http://localhost:8081/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password })
      });
      
      if (!response.ok) throw new Error("Backend save failed");
      
      const savedUser = await response.json();
      // savedUser should contain the auto-generated DB id 
      setUser(savedUser);
      localStorage.setItem('pm_user', JSON.stringify(savedUser));
      return savedUser;
    } catch (err) {
      console.error("Registration error:", err);
      // Fallback if backend is unreachable so the app doesn't die
      const newUser = { id: Date.now(), name, email, role };
      setUser(newUser);
      localStorage.setItem('pm_user', JSON.stringify(newUser));
      return newUser;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pm_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
