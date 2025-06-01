import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/auth/user/login" replace />;

  try {
    const decoded: any = jwtDecode(token); // Consider typing this properly if you know your JWT structure

    console.log('Decoded JWT:', decoded);

    const role = decoded?.role;
    if (role !== 'USER') {
      return <Navigate to="/auth/user/login" replace />;
    }

    return children;
  } catch (err) {
    console.error('Invalid token:', err);
    return <Navigate to="/auth/user/login" replace />;
  }
};

export default ProtectedRoute;
