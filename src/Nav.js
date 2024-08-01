import React, { useEffect, useState } from "react";
import style from './Nav.module.css';
import { Link } from 'react-router-dom';
import axios from "axios";

function Nav() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const accessToken = axios.defaults.headers.common.Authorization;

        if (accessToken) {
          setIsAuthenticated(true);
        }
    }, []);
    const handleLogout = () => {
        axios.post('/api/users/logout')
        .then((response) => {
            alert(response.data.message)
        })
        .catch((error) => {
            alert(error.response.data.message)
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
            <button onClick={() => alert('커뮤니티 기능은 준비 중입니다.')}>커뮤니티</button>
            <Link to="/codereviews">
                <button>Code Review</button>
            </Link>
            <button onClick={() => alert('Group 기능은 준비 중입니다.')}>Group</button>
            {isAuthenticated ? (
                <>
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