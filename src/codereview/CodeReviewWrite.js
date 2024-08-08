import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import './CodeReviewWrite.css';
import reissueToken from '../reissueToken';

const CodeReviewWrite = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [contents, setContents] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newReview = {
      title,
      category,
      contents,
      code
    };

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.post('http://localhost:8080/api/codereviews', newReview, {
        headers: {
          Authorization: `${accessToken}`
        }
      });

      const { message } = response.data;

      alert(message);
      const pointResponse = await axios.patch('http://localhost:8080/api/users/points',
        {
          point : '10', 
          type : 'ADD'
        }, 
        {
        headers: {
          Authorization: `${accessToken}`
        }
      });

      navigate('/codereviews');
    } catch (error) {
      if(error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        reissueToken(error);
      }

      const errorMessage = error.response?.data?.message || 'Failed to create code review. Please try again.';
      alert(errorMessage);
    }
  };

  const handleBack = () => {
    navigate('/codereviews');
  };

  return (
      <div className="code-review-write-container">
        <Nav />
        <div className="white-box">
          <h2>코드 리뷰 등록</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">제목</label>
              <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">카테고리</label>
              <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="#으로 카테고리를 구분해주세요"
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contents">내용</label>
              <textarea
                  id="contents"
                  value={contents}
                  onChange={(e) => setContents(e.target.value)}
                  rows="5"
                  required
              />
            </div>
            <div className="form-group">
              <label htmlFor="code">코드</label>
              <textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows="10"
              />
            </div>
          </form>
          <div className="form-buttons">
            <button type="submit" className="submit-btn" onClick={handleSubmit}>작성하기</button>
            <button type="button" className="back-btn" onClick={handleBack}>뒤로가기</button>
          </div>
        </div>
      </div>
  );
};

export default CodeReviewWrite;
