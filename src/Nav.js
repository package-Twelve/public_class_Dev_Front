import React, {useEffect, useState} from "react";
import style from './Nav.module.css';
import {Link} from 'react-router-dom';
import axios from "axios";

function Nav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasTeam, setHasTeam] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      setIsAuthenticated(true);
      axios.defaults.headers.common['Authorization'] = `${accessToken}`;
      fetchUserTeam();
    }
  }, []);

  const fetchUserTeam = async () => {
    try {
      const teamResponse = await axios.get(
          'http://localhost:8080/api/teams/myteam', {
            headers: {
              Authorization: localStorage.getItem('accessToken')
            }
          });
      if (teamResponse.data.data) {
        setHasTeam(true);
      } else {
        setHasTeam(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasTeam(false);
      } else {
        console.error('팀 정보를 불러오는 데 실패했습니다:', error);
      }
    }
  };

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
    delete axios.defaults.headers.common['Refresh'];
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
      <div className={style["top-menu"]}>
        <Link to="/community">
          <button>커뮤니티</button>
        </Link>
        <Link to="/codereviews">
          <button>Code Review</button>
        </Link>
        {isAuthenticated ? (
            <>
              {hasTeam ? (
                  <Link to="/teams/myteam">
                    <button>나의 팀 페이지</button>
                  </Link>
              ) : (
                  <Link to="/teams/match">
                    <button>팀 매칭</button>
                  </Link>
              )}
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