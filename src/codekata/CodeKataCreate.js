// CodeKataCreate.js
import React, { useState } from 'react';
import axios from 'axios';
import Nav from '../Nav';
import { useNavigate } from 'react-router-dom';
import style from './CodeKataCreate.module.css';

const CodeKataCreate = () => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/codekatas/createcodekata', {
        title,
        contents,
      }, {
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`,
        },
      });
      alert('코드카타가 성공적으로 생성되었습니다.');
      navigate('/codekatas');
    } catch (error) {
      alert(error.response.data.message);
      if(error.response.data.message === "권한이 없습니다.") {
        navigate('/codekatas/today');
      }
    }
  };

  return (
      <>
        <Nav />
        <div className={style.container}>
          <div className={style["container-form"]}>
          <h2>새 코드카타 작성하기</h2>
            <label>제목</label>
          <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
          />
          <label>내용</label>
          <textarea
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              placeholder="내용을 입력하세요"
          ></textarea>
        </div>
          <div className={style.buttonContainer}>
            <button className={style.createButton} onClick={handleCreate}>등록</button>
            <button className={style.cancelButton} onClick={() => navigate('/codekatas')}>취소</button>
          </div>
        </div>
      </>
  );
};

export default CodeKataCreate;
