import React, { useEffect } from 'react';
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
import WritePost from "./communities/WritePost";
import DetailComponent from "./communities/CommunityDetail";
import CommunityFeed from "./communities/CommunityFeed";
import TeamMatch from './team/TeamMatch';
import MyTeamPage from './team/MyTeamPage';
import CodeRunPage from './team/CodeRunPage';
import ChatRoomPage from './team/ChatRoomPage';
import CodeKatasPage from './codekata/CodeKatasPage';
import CodeKataDetail from './codekata/CodeKataDetail';
import TodayCodeKata from './codekata/TodayCodeKata';
import CodeKataCreate from './codekata/CodeKataCreate';
import CodeKataForm from './codekata/CodeKataForm';
import WinnersPage from './winner/WinnersPage';
import WinnerDetailPage from './winner/WinnerDetailPage';

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
          <Route path="/community" element={
            <PrivateRoute>
              <CommunityFeed />
            </PrivateRoute>
          } />
          <Route path="/community/post/:id" element={
            <PrivateRoute>
              <DetailComponent />
            </PrivateRoute>
          }/>
          <Route path="/community/write" element={
            <PrivateRoute>
              <WritePost/>
            </PrivateRoute>
          } />
          <Route path="/match" element={
            <PrivateRoute>
              <TeamMatch />
            </PrivateRoute>
          } />
          <Route path="/myteam/*" element={
            <PrivateRoute>
              <MyTeamPage />
            </PrivateRoute>
          } />
          <Route path="/myteam/coderuns/:teamsId" element={
            <PrivateRoute>
              <CodeRunPage />
            </PrivateRoute>
          } />
          <Route path="/myteam/chatrooms/:teamsId" element={
            <PrivateRoute>
              <ChatRoomPage />
            </PrivateRoute>
          } />
          <Route path="/codekatas/today" element={
            <PrivateRoute>
              <TodayCodeKata />
            </PrivateRoute>
          } />
          <Route path="/codekatas" element={
            <PrivateRoute>
              <CodeKatasPage />
            </PrivateRoute>
          } />
          <Route path="/codekatas/:id" element={
            <PrivateRoute>
              <CodeKataDetail />
            </PrivateRoute>
          } />
          <Route path="/codekatas/create" element={
            <PrivateRoute>
              <CodeKataCreate />
            </PrivateRoute>
          } />
          <Route path="/codekatas/:id/edit" element={
            <PrivateRoute>
              <CodeKataForm />
            </PrivateRoute>
          } />
          <Route path="/winner" element={
            <PrivateRoute>
              <WinnersPage />
            </PrivateRoute>
          } />
          <Route path="/winners/:id" element={
            <PrivateRoute>
              <WinnerDetailPage />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
