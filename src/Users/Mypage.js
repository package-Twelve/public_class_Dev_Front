import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import './Mypage.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
    
const Mypage = () => {
    let navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users/profiles');
            setProfile(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch profile');
            console.log(err);
            setLoading(false);
            if(err.response.data.statusCode === 401) {
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

        fetchProfile();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    //console.log(profile);
    return(
        <>
            <Nav/>
            <div className= "container">
                <div className="profile-header">
                    <div className="profile-info">
                        <h1>{profile.name} <span className="badge">Bronze</span></h1>
                        <p>{profile.email}</p>
                        <p>{profile.intro} </p>
                        <div><Link to="/mypage/update"><button className="button">프로필</button></Link><Link to="/mypage/update/password"><button className="button">비밀번호 초기화</button></Link></div>
                    </div>
                </div>
                <div className="section">
                    <h2>최근 나의 게시글</h2>
                    <ul className="list">
                        <li className="list-item">React Hooks 사용 팁</li>
                        <li className="list-item">CSS Grid 레이아웃 예제</li>
                        <li className="list-item">JavaScript 비동기 프로그래밍 기초</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Mypage;