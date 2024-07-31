import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Signup from './user/Signup';
import Login from './user/Login';
import FirstPage from './FirstPage';
import PrivateRoute from './PrivateRoute';
import Mypage from './user/Mypage';
import CodeReview from "./codereview/CodeReview";
import CodeReviewWrite from './codereview/CodeReviewWrite';
import CodeReviewDetail from './codereview/CodeReviewDetail';
import CodeReviewEdit from './codereview/CodeReviewEdit';
import UpdateMypage from './user/UpdateMyPage';
import UpdatePassword from './user/UpdatePassword';

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
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
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
          <Route path="/codereviews/:id" element={
            <PrivateRoute>
              <CodeReviewDetail />
            </PrivateRoute>
          } />
          <Route path="/codereviews/:id/edit" element={
            <PrivateRoute>
              <CodeReviewEdit />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
