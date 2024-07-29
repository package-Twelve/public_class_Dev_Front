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
import CodeReview from "./CodeReview/CodeReview";
import CodeReviewWrite from './CodeReview/CodeReviewWrite';

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
        <Route path="/codereviews" element={
          <PrivateRoute>
            <CodeReview />
          </PrivateRoute>
        } />
        <Route path="/codereviews/write" element={
          <PrivateRoute>
            <CodeReviewWrite />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
