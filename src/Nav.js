import React, { useEffect, useState } from "react";
import style from './Nav.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import logo from './assets/logo.png';

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
    axios.post('http://localhost:8080/api/users/logout')
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
      const response = await axios.get('http://localhost:8080/api/users/me', {
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      });
      setIsAdmin(response.data.data.roles.includes("ROLE_ADMIN"));
    } catch (error) {
      console.error('Failed to fetch user role:', error);
    }
  };

  return (
      <div className={style["top-menu"]}>
        <Link to="/">
          <img src={logo} alt="홈" className={style.logo} />
        </Link>
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
