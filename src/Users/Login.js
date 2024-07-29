import React, { useState } from "react";
import './Signup.css';
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
            console.log(accessToken);
            console.log(refreshToken);
            
            alert("code: " + response.data.statusCode + "\n" +
            "message: " + response.data.message + "\n" + 
            "data: " + response.data.data
            );

            if(response.data.statusCode === 200) {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken); 
                navigate("/");
            }
        } catch (error) {
            setMessage('Login failed!');
            console.error(error.response.data.message);
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
        <div class="container">
            <h1>login</h1>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력해주세요" required />
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요" required />
            <div class="button-container">
                <button class="login" type="submit">로그인</button>
                <Link to = "/signup"><button class="register">회원가입</button></Link>
            </div>
        </div>
    </form>
    </>
  );
};

export default Login;