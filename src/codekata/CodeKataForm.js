import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Nav from '../Nav';
import style from './CodeKataForm.module.css';

const CodeKataForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  useEffect(() => {
    if (location.state) {
      if (location.state.title) {
        setTitle(location.state.title);
      }
      if (location.state.contents) {
        setContents(location.state.contents);
      }
    } else if (id) {
      const fetchCodeKata = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/codekatas/${id}`, {
            headers: {
              Authorization: `${localStorage.getItem('accessToken')}`
            }
          });
          const data = response.data.data;
          setTitle(data.title);
          setContents(data.contents);
        } catch (error) {
          alert('코드카타를 불러오는데 실패했습니다');
        }
      };

      fetchCodeKata();
    }
  }, [location.state, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = id
        ? `http://localhost:8080/api/codekatas/${id}`
        : 'http://localhost:8080/api/codekatas/createcodekata';
    const method = id ? 'put' : 'post';

    try {
      await axios({
        method,
        url,
        data: { title, contents },
        headers: {
          Authorization: `${localStorage.getItem('accessToken')}`
        }
      });
      alert(`코드카타가 성공적으로 ${id ? '수정' : '생성'}되었습니다.`);
      navigate('/codekatas');
    } catch (error) {
      alert(`코드카타 ${id ? '수정' : '생성'}에 실패했습니다.`);
      if(error.response.data.message === "권한이 없습니다.") {
        navigate('/codekatas/today');
      }
    }
  };

  return (
      <>
        <Nav />
        <div className={style.container}>
          <h2>{id ? '코드카타 수정하기' : '새 코드카타 작성하기'}</h2>
          <form className={style.form} onSubmit={handleSubmit}>
            <label htmlFor="title">제목</label>
            <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <label htmlFor="contents">내용</label>
            <textarea
                id="contents"
                value={contents}
                onChange={(e) => setContents(e.target.value)}
                required
            />
            <div className={style.buttons}>
              <button type="submit">
                {id ? '수정' : '등록'}
              </button>
              <button type="button" onClick={() => navigate('/codekatas')}>
                취소
              </button>
            </div>
          </form>
        </div>
      </>
  );
};

export default CodeKataForm;
