import React, { useState } from "react";
import style from './Signup.module.css';
import axios from "axios";
import Nav from '../Nav'
import { Link, Navigate, useNavigate } from 'react-router-dom';


const Login = () => {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
  
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/users/login', {
            email: formData.email,
            password: formData.password
            });

            const accessToken = response.data.data.accessToken;
            const refreshToken = response.data.data.refreshToken;

            if(response.data.statusCode === 200) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken); 
                navigate("/");
            }
        } catch (error) {
            setMessage('Login failed!');
            alert(error.response.data.message);
        }
    };

    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.5)';
        });
        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
        });
    });
  
  return (
    <>
    <Nav/>
    <form onSubmit={handleSubmit}>
        <div className={style.container}>
            <h1>login</h1>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력해주세요" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요" required />
            <div className={style["button-container"]}>
                <button className={style.login} type="submit">로그인</button>
                <Link to = "/signup"><button className={style.register}>회원가입</button></Link>
            </div>
        </div>
    </form>
    </>
  );
};

export default Login;