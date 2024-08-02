import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import CodeRunPage from './CodeRunPage';
import ChatRoomPage from './ChatRoomPage';
import style from './MyTeamPage.module.css';

const MyTeamPage = () => {
  const [team, setTeam] = useState(null);
  const [activeTab, setActiveTab] = useState('team');
  const navigate = useNavigate();

  const fetchTeam = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/teams/myteam', {
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      });
      setTeam(response.data.data);
    } catch (error) {
      console.error('팀 정보를 불러오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab !== 'team') {
      navigate(`/teams/myteam/${tab}`);
    } else {
      navigate('/myteam');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If date is invalid, return today's date
      const today = new Date();
      return `${today.toLocaleDateString()} ${today.toLocaleTimeString()}`;
    }
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
      <>
        <Nav />
        <div className={style["my-team-page-container"]}>
          <div className={style["white-box"]}>
            {team ? (
                <>
                  <h2 className={style["team-name"]}>{team.name}</h2>
                  <div className={style["section"]}>
                    <h3>참여 유저</h3>
                    <ul>
                      {team.teamMembers.map((member, index) => (
                          <li key={index}>
                            <span>{member.name}</span>
                            <span>{member.rank}</span>
                            <span>{formatDate(member.joinedAt)}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                  <div className={style["tabs"]}>
                    <button onClick={() => handleTabClick('team')}>팀 정보</button>
                    <button onClick={() => handleTabClick('coderuns')}>코드 실행</button>
                    <button onClick={() => handleTabClick('chatrooms')}>채팅방</button>
                  </div>
                  <Routes>
                    <Route path="/" element={<div>팀 정보를 선택하세요.</div>} />
                    <Route path="coderuns" element={<CodeRunPage />} />
                    <Route path="chatrooms" element={<ChatRoomPage />} />
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
