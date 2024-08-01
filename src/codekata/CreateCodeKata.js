import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import style from './CreateCodeKata.module.css';

const CreateCodeKata = () => {
  const [contents, setContents] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/codekatas', {
        contents
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      navigate('/codekatas/manage');
    } catch (error) {
      console.error('Failed to create code kata:', error);
      setError('코드카타를 생성하는 데 실패했습니다.');
    }
  };

  return (
      <>
        <Nav />
        <div className={style["create-code-kata-container"]}>
          <div className={style["white-box"]}>
            <h2>코드카타 작성</h2>
            <form onSubmit={handleSubmit}>
            <textarea
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                placeholder="코드카타 내용을 입력하세요"
            />
              <button type="submit">작성</button>
              {error && <p className={style["error"]}>{error}</p>}
            </form>
          </div>
        </div>
      </>
  );
};

export default CreateCodeKata;
