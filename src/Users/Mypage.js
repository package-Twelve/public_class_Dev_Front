import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import './Mypage.css';
import axios from "axios";
    
const Mypage = () => {
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
            setLoading(false);
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
                        <p>{profile.intro}</p>
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