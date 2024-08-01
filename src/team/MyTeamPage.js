import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Route, Routes } from 'react-router-dom';
import Nav from '../Nav';
import CodeRunPage from './CodeRunPage';
import ChatRoomPage from './ChatRoomPage';
import './MyTeamPage.module.css';

const MyTeamPage = () => {
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/teams/myteam', {
          headers: {
            Authorization: localStorage.getItem('accessToken')
          }
        });
        setTeams(response.data.data);
      } catch (error) {
        console.error('팀 정보를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchTeam();
  }, []);

  return (
      <>
        <Nav />
        <div className="my-team-page-container">
          <div className="white-box">
            {teams ? (
                <>
                  <h2 className="team-name">{teams.name}</h2>
                  <div className="section">
                    <h3>참여 유저</h3>
                    <ul>
                      {teams.teamMembers.map((member, index) => (
                          <li key={index}>
                            <span>{member.name}</span>
                            <span>{member.rank}</span>
                            <span>{new Date(member.joinedAt).toLocaleDateString()} {new Date(member.joinedAt).toLocaleTimeString()}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                  <div className="section">
                    <Link to={`/teams/myteam/coderuns`}>코드 실행</Link>
                    <Link to={`/teams/myteam/chatrooms`}>채팅방</Link>
                  </div>
                  <Routes>
                    <Route path="coderuns" element={<CodeRunPage />} />
                    <Route path="chatroom" element={<ChatRoomPage />} />
                  </Routes>
                </>
            ) : (
                <p>팀 정보를 불러오는 중...</p>
            )}
          </div>
        </div>
      </>
  );
};

export default MyTeamPage;
