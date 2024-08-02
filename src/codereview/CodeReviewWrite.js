import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../Nav'; // Nav 컴포넌트를 가져옵니다.
import './CodeReviewWrite.css'; // CSS 파일을 따로 생성해서 스타일을 추가합니다.
import reissueToken from '../reissueToken';

const CodeReviewWrite = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [contents, setContents] = useState('');
  const [code, setCode] = useState(''); // 코드 필드 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    const newReview = {
      title,
      category,
      contents,
      code // 코드 필드는 비워도 됨
    };

    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await axios.post('http://localhost:8080/api/codereviews', newReview, {
        headers: {
          Authorization: `${accessToken}`
        }
      });

      // 서버 응답에서 message 추출
      const { message } = response.data;

      // 알림 창에 message 표시
      alert(message);
      // 포인트 10 증가
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

      // 성공적으로 작성 후 코드 리뷰 목록으로 이동
      navigate('/codereviews');
    } catch (error) {
      if(error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        reissueToken(error);
      }
      console.error('Error creating code review:', error);

      // 서버 응답에서 error 메시지를 추출하여 알림으로 표시
      const errorMessage = error.response?.data?.message || 'Failed to create code review. Please try again.';
      alert(errorMessage);
    }
  };

  const handleBack = () => {
    navigate('/codereviews'); // 뒤로가기 버튼 클릭 시 코드 리뷰 목록으로 이동
  };

  return (
      <div className="code-review-write-container">
        <Nav /> {/* 여기에 Nav 컴포넌트를 추가합니다. */}
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
