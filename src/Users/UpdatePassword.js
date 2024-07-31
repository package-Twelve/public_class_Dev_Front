import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import './Mypage.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import reissueToken from "../reissueToken";
    
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
        } catch (err) {
            alert(err.response.data.message);
            if(err.response.data.statusCode === 401 && err.response.data.message === "토큰이 만료되었습니다.") {
                reissueToken(err);
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