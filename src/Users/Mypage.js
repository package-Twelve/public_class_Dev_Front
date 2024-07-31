import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import style from './Mypage.module.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import reissueToken from "../reissueToken";
    
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
            if(err.response.data.statusCode === 401 && err.response.data.message === "토큰이 만료되었습니다.") {
                reissueToken(err);
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
            <div className= {style.container}>
                <div className={style["profile-header"]}>
                    <div className={style["profile-info"]}>
                            <h1>{profile.name} <span className={style.badge}>Bronze</span></h1>
                            <p>{profile.email}</p>
                            <p>{profile.intro} </p>
                    </div>
                    <div className={style["button-container"]}>
                        <Link to="/mypage/update"><button className={style.button}>프로필</button></Link>
                        <Link to="/mypage/update/password"><button className={style.button}>비밀번호 초기화</button></Link>
                    </div>
                </div>
                <div className={style.section}>
                    <h2>최근 나의 게시글</h2>
                    <ul className={style.list}>
                        <li className={style["list-item"]}>React Hooks 사용 팁</li>
                        <li className={style["list-item"]}>CSS Grid 레이아웃 예제</li>
                        <li className={style["list-item"]}>JavaScript 비동기 프로그래밍 기초</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Mypage;