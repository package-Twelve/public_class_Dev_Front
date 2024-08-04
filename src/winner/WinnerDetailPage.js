import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';
import style from './WinnerDetailPage.module.css';
import Nav from '../Nav';

const WinnerDetailPage = () => {
  const {id} = useParams();
  const [winner, setWinner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const response = await axios.get(
            `/api/winners/${id}`);
        setWinner(response.data.data);
      } catch (error) {
        console.error('우승자 정보를 불러오는데 실패했습니다:', error);
      }
    };

    fetchWinner();
  }, [id]);

  return (
      <div className={style.container}>
        <Nav/>
        <div className={style.detailPage}>
        <h2>우승자 상세 페이지</h2>
        {winner ? (
            <div className={style.detail}>
              <p>팀 이름: {winner.teamName}</p>
              <p>언어: {winner.language}</p>
              <p>응답 시간: {winner.responseTime} ms</p>
              <p>결과: {winner.result}</p>
              <p>코드: {winner.code}</p>
              <p>코드카타 제목: {winner.codeKataTitle}</p>
              <p>코드카타 내용: {winner.codeKataContents}</p>
            </div>
        ) : (
            <p>우승자 정보를 불러오는 중...</p>
        )}
        <button className={style.backButton} onClick={() => navigate('/winner')}>뒤로가기</button>
        </div>
      </div>
  );
};

export default WinnerDetailPage;
