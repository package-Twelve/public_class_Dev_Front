import React, { useEffect, useState } from "react";
import './Nav.css';
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
        axios.post('http://localhost:8080/api/users/logout')
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

    const handleAlert = (message) => {
        alert(message);
    };

    return (
        <div className="top-menu">
            <Link to="/community">
                <button className="top-menu-button">커뮤니티</button>
            </Link>
            <button className="top-menu-button" onClick={() => handleAlert('Code Review 기능은 준비 중입니다.')}>Code Review</button>
            <button className="top-menu-button" onClick={() => handleAlert('Group 기능은 준비 중입니다.')}>Group</button>
            {isAuthenticated ? (
                <>
                    <Link to="/mypage">
                        <button className="top-menu-button">마이페이지</button>
                    </Link>
                    <button className="top-menu-button" onClick={handleLogout}>로그아웃</button>
                </>
            ) : (
                <>
                    <Link to="/login">
                        <button className="top-menu-button">로그인</button>
                    </Link>
                    <Link to="/signup">
                        <button className="top-menu-button">회원가입</button>
                    </Link>
                </>
            )}
        </div>
    );
}

export default Nav;