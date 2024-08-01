import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import './TeamMatch.module.css';

const TeamMatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    const applyForMatch = async () => {
      if (isMatching) {
        return; // 이미 매칭 중인 경우, 추가 요청을 방지
      }

      setIsMatching(true); // 매칭 시작

      try {
        const response = await axios.post(
            'http://localhost:8080/api/teams/match',
            null,
            {
              headers: {
                Authorization: localStorage.getItem('accessToken')
              }
            }
        );

        if (response.data && response.data.statusCode === 200) {
          alert(response.data.message);
          navigate(`/teams/myteam`);
        } else {
          throw new Error('응답 데이터가 유효하지 않습니다.');
        }
      } catch (error) {
        console.error('팀 매칭 신청 실패:', error);
        alert('팀 매칭 신청에 실패했습니다. 나중에 다시 시도해 주세요.');
      } finally {
        setLoading(false);
        setIsMatching(false); // 매칭 완료
      }
    };

    applyForMatch();
  }, [navigate, isMatching]);

  return (
      <>
        <Nav />
        <div className="team-match-container">
          <div className="white-box">
            <h2>팀 매칭 중...</h2>
          </div>
        </div>
      </>
  );
};

export default TeamMatch;
