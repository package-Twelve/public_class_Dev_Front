import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import style from './Mypage.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import reissueToken from "../reissueToken";
    
const UpdateMypage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        intro: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/profiles');
                setFormData({
                    ...formData,
                    "name" : response.data.data.name,
                    "intro" : response.data.data.intro
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile');
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
            const response = await axios.patch('http://localhost:8080/api/users/profiles', {
            name: formData.name,
            intro: formData.intro
            });
            
            alert("code: " + response.data.statusCode + "\n" +
            "message: " + response.data.message + "\n"
            );

            if(response.data.statusCode === 200) {
                navigate("/mypage");
            }
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return(
        <>
            <Nav/>
            <div className={style.container}>
                <form onSubmit={handleSubmit}>
                    <div className={style["profile-header"]}>
                        <div className={style["profile-info"]}>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름을 입력해주세요" required />
                            <input type="text" name="intro" value={formData.intro} onChange={handleChange} placeholder="자기소개를 입력해주세요" required />
                        </div>
                    </div>
                    <div className={style.section}>
                        <button type="submit">수정</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UpdateMypage;