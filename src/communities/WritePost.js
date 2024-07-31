import React, { useState } from 'react';
import style from './WritePost.module.css'; // CSS Module import
import axios from "axios";
import { useNavigate } from "react-router-dom";
import reissueToken from "../reissueToken";
import Nav from "../Nav";

const WritePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const categoryMapping = {
    info: 'INFO',
    chat: 'GOSSIP',
    job: 'RECRUIT',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem('accessToken');
    if (title && category && content && content.length >= 3) {
      const backendCategory = categoryMapping[category];
      const postData = { title, content, category: backendCategory };
      try {
        const response = await axios.post('http://localhost:8080/api/community', postData, {
          headers: {
            Authorization: `${accessToken}`
          }
        });
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          alert('게시글이 성공적으로 등록되었습니다.');
          navigate('/community'); // Use navigate for routing instead of window.location.href
        } else {
          alert('게시글 등록에 실패했습니다.');
        }
      } catch (error) {
        if (error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
          await reissueToken(error);
        }
      }
    } else {
      if (!title || !category || !content) {
        alert('모든 필드를 채워주세요.');
      } else if (content.length < 3) {
        alert('내용은 최소 3글자 이상이어야 합니다.');
      }
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
      navigate('/community'); // Use navigate for routing instead of window.location.href
    }
  };

  return (
      <div className={style["write-post-container"]}>
        <Nav />
        <h1 className={style["write-post-title"]}>새 글 작성하기</h1>
        <form className={style["write-post-form"]} onSubmit={handleSubmit}>
          <div className={style["write-post-form-group"]}>
            <label className={style["write-post-label"]} htmlFor="title">제목</label>
            <input
                type="text"
                id="title"
                name="title"
                className={style["write-post-input"]}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="제목을 입력하세요"
            />
          </div>

          <div className={style["write-post-form-group"]}>
            <label className={style["write-post-label"]} htmlFor="category">카테고리</label>
            <select
                id="category"
                name="category"
                className={style["write-post-select"]}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
              <option value="">카테고리 선택</option>
              <option value="info">정보</option>
              <option value="chat">잡담</option>
              <option value="job">취업</option>
            </select>
          </div>

          <div className={style["write-post-form-group"]}>
            <label className={style["write-post-label"]} htmlFor="content">내용</label>
            <textarea
                id="content"
                name="content"
                className={style["write-post-textarea"]}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="내용을 입력하세요"
            ></textarea>
          </div>

          <div className={style["write-post-button-group"]}>
            <button
                type="button"
                className={style["write-post-cancel-button"]}
                onClick={handleCancel}
            >
              취소
            </button>
            <button type="submit" className={style["write-post-submit-button"]}>
              등록
            </button>
          </div>
        </form>
      </div>
  );
};

export default WritePost;
