// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      axios.defaults.headers.common['Authorization'] = `${accessToken}`;
      axios.defaults.headers.common['Refresh'] = `${refreshToken}`;
    }
  return accessToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
