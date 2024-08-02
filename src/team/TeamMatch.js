import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import reissueToken from '../reissueToken';
import style from './TeamMatch.module.css'; // CSS Module import

const TeamMatch = () => {
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const checkUserTeamStatus = async () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken); // 토큰을 출력하여 확인

    try {
      const response = await axios.get('http://localhost:8080/api/teams/myteam', {
        headers: {
          Authorization: `${accessToken}`
        }
      });
      console.log('Response:', response);
      setTeam(response.data.data);
    } catch (error) {
      console.error('Error checking user team status:', error);
      if (error.response && error.response.status === 403) {
        // 권한이 없는 경우 토큰 재발급 시도
        await reissueToken(error);
      } else {
        setError('팀 상태 확인에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleCreateTeam = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      console.log('Creating team...');
      const response = await axios.post('http://localhost:8080/api/teams/create', {}, {
        headers: {
          Authorization: `${accessToken}`
        }
      });
      console.log('Response:', response);
      setTeam(response.data.data);
      alert('팀이 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('Error creating team:', error);
      if (error.response && error.response.status === 403) {
        // 권한이 없는 경우 토큰 재발급 시도
        await reissueToken(error);
      } else {
        alert('팀 생성에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    checkUserTeamStatus();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!team) {
    return (
        <div className={style.container}>
          <p>팀 매칭 중...</p>
          <button onClick={handleCreateTeam} disabled={isSubmitting}>팀 생성하기</button>
        </div>
    );
  }

  return (
      <div className={style.container}>
        <h1>팀 매칭 성공</h1>
        <h2>팀 이름: {team.name}</h2>
        <ul>
          {team.members.map(member => (
              <li key={member.id}>{member.name}</li>
          ))}
        </ul>
      </div>
  );
};

export default TeamMatch;
