import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';
import style from './CodeKatasPage.module.css';

const CodeKatasPage = () => {
  const [codeKatas, setCodeKatas] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/profiles', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        const profile = response.data.data;
        console.log(profile);
        if (profile && profile.role && profile.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('사용자 프로필을 불러오는데 실패했습니다:', error);
      }
    };

    const fetchAllCodeKatas = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/codekatas/all', {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        setCodeKatas(response.data.data);
      } catch (error) {
        console.error('전체 코드카타를 불러오는데 실패했습니다:', error);
      }
    };

    fetchProfile();
    fetchAllCodeKatas();
  }, []);

  return (
      <>
        <Nav />
        <div className={style.container}>
          <h2>코드카타 목록</h2>
          <div className={style.codeKatasList}>
            {codeKatas.length > 0 ? (
                codeKatas.map((kata) => (
                    <div key={kata.id} className={style.codeKataItem}>
                      <p>{kata.contents}</p>
                      <button className={style.button} onClick={() => navigate(`/codekatas/${kata.id}`)}>상세보기</button>
                    </div>
                ))
            ) : (
                <p>코드카타가 없습니다.</p>
            )}
          </div>
          {isAdmin && (
              <button className={style.button} onClick={() => navigate('/codekatas/create')}>새 코드카타 작성하기</button>
          )}
        </div>
      </>
  );
};

export default CodeKatasPage;
