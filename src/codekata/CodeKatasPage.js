import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';
import style from './CodeKatasPage.module.css';

const CodeKatasPage = () => {
  const [codeKatas, setCodeKatas] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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

    const fetchCodeKatas = async (page) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/codekatas/all?page=${page}&size=6`, {
          headers: {
            Authorization: `${localStorage.getItem('accessToken')}`
          }
        });
        setCodeKatas(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
      } catch (error) {
        console.error('전체 코드카타를 불러오는데 실패했습니다:', error);
      }
    };

    fetchProfile();
    fetchCodeKatas(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
      <>
        <Nav />
        <div className={style.container}>
          <div className={style["container-header"]}>
          <h2>코드카타 목록</h2>
          {isAdmin && (
              <button className={style.createButton} onClick={() => navigate('/codekatas/create')}>코드카타 작성</button>
          )}
          </div>
          <div className={style.codeKatasList}>
            {codeKatas.length > 0 ? (
                codeKatas.map((kata) => (
                    <div key={kata.id} className={style.codeKataItem}>
                      <h3>{kata.title}</h3> {/* 코드카타 제목 표시 */}
                      <button className={style.button} onClick={() => navigate(`/codekatas/${kata.id}`)}>상세보기</button>
                    </div>
                ))
            ) : (
                <p>코드카타가 없습니다.</p>
            )}
          </div>
          <div className={style.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    className={currentPage === index ? style.activePage : ''}
                >
                  {index + 1}
                </button>
            ))}
          </div>
        </div>
      </>
  );
};

export default CodeKatasPage;
