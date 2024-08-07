import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import style from './Mypage.module.css';
import axios from "axios";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import reissueToken from "../reissueToken";
import MyTeamPage from '../team/MyTeamPage';

const Mypage = () => {
    let navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [postlist, setPostlist] = useState();
    const [point, setPoint] = useState({
        point: '',
        rank: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const categoryMapping = {
        INFO: '정보',
        GOSSIP: '잡담',
        RECRUIT: '취업',
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/users/profiles');
                console.log(response);
                setProfile(response.data.data);
                setPostlist(response.data.data.recentCommunities);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile');
                console.log(err);
                setLoading(false);
                if(err.response.data.statusCode === 401 && err.response.data.message === "토큰이 만료되었습니다.") {
                    reissueToken(err);
                }
            }
            try {
                const pointResponse = await axios.get('/api/users/points');
                setPoint({
                    ...point,
                    point: pointResponse.data.data.point,
                    rank: pointResponse.data.data.rank
                })
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handlePostClick = (postId) => {
        navigate(`/community/post/${postId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    //console.log(profile);
    return(
        <>
            <Nav/>
            <div className= {style.container}>
                <div className={style["profile-header"]}>
                    <div className={style["profile-info"]}>
                        <h1>
                            {profile.name}
                            {point.rank === 'BRONZE' ? (<span className={style["badge-bronze"]}>Bronze</span>) :
                                (point.rank === 'SILVER' ? (<span className={style["badge-silver"]}>Silver</span>) :
                                    (point.rank === 'GOLD' ? (<span className={style["badge-gold"]}>GOLD</span>) : (<p>Error</p>)))
                            }
                        </h1>
                        <p>{profile.email}</p>
                        <p>{profile.intro} </p>
                    </div>
                    <div className={style["button-container"]}>
                        <Link to="/mypage/update"><button className={style.button}>프로필</button></Link>
                        <Link to="/mypage/update/password"><button className={style.button}>비밀번호 초기화</button></Link>
                    </div>
                </div>
                <div className={style.stats}>
                    <div className={style["stat-item"]}>
                        <div className={style["stat-label"]}>포인트</div>
                        <div className={style["stat-value"]}>{point.point}</div>
                    </div>
                </div>
                <div className={style.section}>
                    <h2>최근 나의 게시글</h2>
                    <ul className={style.list}>
                        {postlist.length > 0 ? (
                            postlist.map((post) => (
                                <li className={style["list-item"]} onClick={() => handlePostClick(post.id)}>
                                    <div
                                        className={style.post}
                                        key={post.id}
                                    >
                                        <h3>{post.title}</h3>
                                        <p className={style["post-info"]}>
                                            작성일: {formatDate(post.createdAt)} |
                                            카테고리: {categoryMapping[post.category]}
                                        </p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className={style["list-item"]}>최근 올린 게시글이 없습니다</li>
                        )}
                    </ul>
                </div>
            </div>
            <Routes>
                <Route path="/team" element={<MyTeamPage userName={profile.name} userRank={point.rank} />} />
            </Routes>
        </>
    );
};

export default Mypage;
