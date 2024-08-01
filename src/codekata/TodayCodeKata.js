import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import style from './TodayCodeKata.module.css';

const TodayCodeKata = () => {
  const [codeKata, setCodeKata] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodayCodeKata = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/codekatas/today', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        setCodeKata(response.data.data);
      } catch (error) {
        console.error('Failed to fetch today\'s code kata:', error);
        setError('오늘의 코드카타를 불러오는 데 실패했습니다.');
      }
    };

    fetchTodayCodeKata();
  }, []);

  return (
      <>
        <Nav />
        <div className={style["today-code-kata-container"]}>
          <div className={style["white-box"]}>
            {error ? (
                <p className={style["error"]}>{error}</p>
            ) : codeKata ? (
                <>
                  <h2>오늘의 코드카타</h2>
                  <p>{codeKata.contents}</p>
                  <p>마크 날짜: {new Date(codeKata.markDate).toLocaleDateString()}</p>
                </>
            ) : (
                <p>로딩 중...</p>
            )}
          </div>
        </div>
      </>
  );
};

export default TodayCodeKata;
