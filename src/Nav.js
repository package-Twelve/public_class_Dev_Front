import React, { useEffect, useState } from "react";
import style from './Nav.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import logo from './assets/logo.png';

function Nav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `${accessToken}`;
      setIsAuthenticated(true);
      fetchProfile();
    } else {
      setLoading(false);
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

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/users/profiles', {
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

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
                    <Link to="/manage/teams/all">
                      <button>팀 관리</button>
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
