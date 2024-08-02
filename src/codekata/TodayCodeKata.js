import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';
import style from './TodayCodeKata.module.css';

const TodayCodeKata = () => {
  const [todayCodeKata, setTodayCodeKata] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayCodeKata = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/codekatas/today');
        setTodayCodeKata(response.data.data);
      } catch (error) {
        console.error('오늘의 코드카타를 불러오는데 실패했습니다:', error);
      }
    };

    fetchTodayCodeKata();
  }, []);

  const handleTeamMatch = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/teams/create', {}, {
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      });
      console.log('팀 생성됨:', response.data);
      navigate('/myteam');
    } catch (error) {
      console.error('팀 생성에 실패했습니다:', error);
      alert('팀 생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
      <>
        <Nav />
        <div className={style.container}>
          <h2>오늘의 코드카타</h2>
          {todayCodeKata ? (
              <div className={style.todayCodeKata}>
                <h3>{todayCodeKata.title}</h3>
                <p>{todayCodeKata.contents}</p>
                <button onClick={handleTeamMatch}>코드카타 참여하기</button>
              </div>
          ) : (
              <p>오늘의 코드카타를 불러오는 중...</p>
          )}
          <div className={style.navButtons}>
            <button className={style.navButton} onClick={() => navigate('/codekatas')}>조회</button>
            <button className={style.navButton} onClick={() => navigate('/codekatas/create')}>생성</button>
          </div>
        </div>
      </>
  );
};

export default TodayCodeKata;
