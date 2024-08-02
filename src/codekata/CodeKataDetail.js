// CodeKataDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav';
import style from './CodeKataDetail.module.css';

const CodeKataDetail = () => {
  const { id } = useParams();
  const [codeKata, setCodeKata] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCodeKata = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/codekatas/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        setCodeKata(response.data.data);
      } catch (error) {
        console.error('코드카타를 불러오는데 실패했습니다:', error);
      }
    };

    fetchCodeKata();
  }, [id]);

  const handleEditCodeKata = () => {
    navigate(`/codekatas/${id}/edit`, { state: { title: codeKata.title, contents: codeKata.contents } });
  };

  const handleDeleteCodeKata = async () => {
    if (window.confirm('코드카타를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/codekatas/${id}`, {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        alert('코드카타가 성공적으로 삭제되었습니다.');
        navigate('/codekatas');
      } catch (error) {
        console.error('코드카타 삭제에 실패했습니다:', error);
        alert('코드카타 삭제에 실패했습니다.');
      }
    }
  };

  return (
      <>
        <Nav />
        <div className={style.container}>
          <h2>코드카타 상세 페이지</h2>
          {codeKata ? (
              <div className={style.detailBox}>
                <h3>{codeKata.title}</h3> {/* 코드카타 제목 표시 */}
                <p>{codeKata.contents}</p>
                <div className={style.buttons}>
                  <button onClick={handleEditCodeKata}>수정</button>
                  <button onClick={handleDeleteCodeKata}>삭제</button>
                </div>
              </div>
          ) : (
              <p>코드카타를 불러오는 중...</p>
          )}
          <button className={style.backButton} onClick={() => navigate('/today')}>뒤로가기</button>
        </div>
      </>
  );
};

export default CodeKataDetail;
