import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import reissueToken from '../reissueToken';
import style from './TeamMatch.module.css';

const TeamMatch = () => {
  const [team, setTeam] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const checkUserTeamStatus = async () => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Access Token:', accessToken);

    try {
      const response = await axios.get('/api/teams/myteam',
          {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`
            }
          });
      console.log('Response:', response);
      setTeam(response.data.data);
    } catch (error) {
      console.error('Error checking user team status:', error);
      if (error.response && error.response.status === 403) {
        await reissueToken(error);
      } else {
        setError('팀 상태 확인에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleCreateTeam = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      console.log('Creating team...');
      const response = await axios.post(
          '/api/teams/create', {}, {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`
            }
          });
      console.log('Response:', response);
      setTeam(response.data.data);
      alert('팀이 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('Error creating team:', error);
      if (error.response && error.response.status === 403) {
        await reissueToken(error);
      } else {
        alert('팀에 소속이 되어있어 매칭을 할 수 없습니다.');
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
          <button onClick={handleCreateTeam} disabled={isSubmitting}>팀 생성하기
          </button>
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
