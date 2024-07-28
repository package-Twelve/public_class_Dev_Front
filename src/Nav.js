import React from "react";
import './Nav.css';
import { Link } from 'react-router-dom';

function Nav() {
    return(
        <div class="top-menu">
            <button class="top-menu-button" onclick="alert('커뮤니티 기능은 준비 중입니다.')">커뮤니티</button>
            <button class="top-menu-button" onclick="alert('Code Review 기능은 준비 중입니다.')">Code Review</button>
            <button class="top-menu-button" onclick="alert('Group 기능은 준비 중입니다.')">Group</button>
            <button class="top-menu-button" onclick="alert('로그인 기능은 준비 중입니다.')"><Link to="/login">로그인</Link></button>
            <button class="top-menu-button" onclick="alert('회원가입 기능은 준비 중입니다.')">회원가입</button>
        </div>
    );
}

export default Nav;