import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import './Mypage.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
    
const UpdatePassword = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        password: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setMessage("비밀번호가 일치하지 않습니다.");
            alert(message);
            return;
          }

        try {
            const response = await axios.patch('http://localhost:8080/api/users/profiles/passwords', { password: formData.password });
            
            alert("code: " + response.data.statusCode + "\n" +
            "message: " + response.data.message + "\n"
            );

            if(response.data.statusCode === 200) {
                navigate("/mypage");
            }
        } catch (error) {
            alert(error.response.data.message);
            if(error.response.data.statusCode === 401) {
                const refreshToken = localStorage.getItem('refreshToken');
                delete axios.defaults.headers.common['Authorization'];
                delete axios.defaults.headers.common['Refresh'];
                try{
                    const refreshResponse = await axios.post('http://localhost:8080/api/users/reissue-token', { refreshToken : refreshToken });
                    console.log(refreshResponse);
                    const accessToken = refreshResponse.data.data.accessToken;
                    const newRefreshToken = refreshResponse.data.data.refreshToken;
                    if(refreshResponse.data.statusCode === 200) {
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', newRefreshToken); 
                        window.location.reload();
                    }
                } catch(err) {
                    console.log(err);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate("/login");
                }
                
            }
        }
    };

    //console.log(profile);
    return(
        <>
            <Nav/>
            <div className= "container">
                <form onSubmit={handleSubmit}>
                    <div className="profile-header">
                        <div className="profile-info">
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="비밀번호를 입력해주세요" required />
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="비밀번호를 다시 입력해주세요" required />
                        </div>
                    </div>
                    <div className="section">
                        <button type="submit">수정</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdatePassword;