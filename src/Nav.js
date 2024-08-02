import React, { useEffect, useState } from "react";
import style from './Nav.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function Nav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `${accessToken}`;
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    axios.post('/api/users/logout')
    .then((response) => {
      alert(response.data.message);
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    window.location.reload();
  };

  const checkAdminRole = async () => {
    try {
      const response = await axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setIsAdmin(response.data.data.roles.includes("ROLE_ADMIN"));
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  const handleTeamMatch = async () => {
    try {
      const response = await axios.post('/api/teams/create');
      console.log('Team created:', response.data);
      navigate('/myteam');
    } catch (error) {
      console.error('Error creating team:', error);
      alert('팀 생성에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
      <div className={style["top-menu"]}>
        <Link to="/community">
          <button>커뮤니티</button>
        </Link>
        <Link to="/codereviews">
          <button>Code Review</button>
        </Link>
        <Link to="/codekatas/today">
          <button>오늘의 코드카타</button>
        </Link>
        <Link to="/winner">
          <button>명예의 전당</button>
        </Link>
        {isAuthenticated ? (
            <>
              {isAdmin && (
                  <>
                    <Link to="/codekatas/create">
                      <button>코드카타 작성</button>
                    </Link>
                    <Link to="/codekatas/all">
                      <button>코드카타 조회</button>
                    </Link>
                  </>
              )}
              <button onClick={handleTeamMatch}>팀 매칭</button>
              <Link to="/myteam">
                <button>나의 팀</button>
              </Link>
              <Link to="/mypage">
                <button>마이페이지</button>
              </Link>
              <button onClick={handleLogout}>로그아웃</button>
            </>
        ) : (
            <>
              <Link to="/login">
                <button>로그인</button>
              </Link>
              <Link to="/signup">
                <button>회원가입</button>
              </Link>
            </>
        )}
      </div>
  );
}

export default Nav;
