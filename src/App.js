import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Signup from './Users/Signup';
import Login from './Users/Login';
import FirstPage from './FirstPage';
import PrivateRoute from './PrivateRoute';
import Mypage from './Users/Mypage';
import UpdateMypage from './Users/UpdateMyPage';
import UpdatePassword from './Users/UpdatePassword';
import CommunityApp from "./Communities/CommunityApp";

function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) {
      axios.defaults.headers.common['Authorization'] = `${accessToken}`;
      axios.defaults.headers.common['Refresh'] = `${refreshToken}`;
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path="/community" element={
          <PrivateRoute>
            <CommunityApp />
          </PrivateRoute>
        } />
        <Route path="/" element={
          <PrivateRoute>
            <FirstPage />
          </PrivateRoute>
        } />
        <Route path="/mypage" element={
          <PrivateRoute>
            <Mypage />
          </PrivateRoute>
        } />
        <Route path="/mypage/update" element={
          <PrivateRoute>
            <UpdateMypage />
          </PrivateRoute>
        } />
        <Route path="/mypage/update/password" element={
          <PrivateRoute>
            <UpdatePassword />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
