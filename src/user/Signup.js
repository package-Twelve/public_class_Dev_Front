import React, { useState } from 'react';
import style from './Signup.module.css';
import axios from 'axios';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    admin: '',
    adminToken: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    if(e.target.name === "admin") {
      setFormData({
        ...formData,
        "admin": e.target.checked
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      alert(message);
      return;
    }

    try {
      const response = await axios.post('/api/users/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        admin: formData.admin,
        adminToken: formData.adminToken
      });
      
      alert("code: " + response.data.statusCode + "\n" +
        "message: " + response.data.message + "\n" + 
        "data: " + response.data.data
      );
      navigate(`/login`);
    } catch (error) {
      setMessage('Signup failed!');
      console.error(error.response.data.message);
    }
  };
  document.querySelectorAll('input, select').forEach(input => {
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
              <h1>sign up</h1>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="닉네임을 입력해주세요" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="이메일을 입력해주세요" required />
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요" required />
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력해주세요" required />
              <div className={style["checkbox-container"]}>
                  <input type="checkbox" name="admin" onChange={handleChange}/>
                  <label for="terms">관리자 회원가입</label>
              </div>
              <input type="password" name="adminToken" value={formData.adminToken} onChange={handleChange} placeholder="관리자 암호"/>
              <button type="submit">회원가입</button>
          </div>
      </form>
    </>
  );
};

export default Signup;
