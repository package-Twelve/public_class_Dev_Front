import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav'; // Nav 컴포넌트를 가져옵니다.
import './CodeReviewEdit.css'; // CSS 파일을 따로 생성해서 스타일을 추가합니다.

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `${localStorage.getItem('accessToken')}`
  }
});

const CodeReviewEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [contents, setContents] = useState('');
  const [code, setCode] = useState(''); // 코드 필드 상태 추가
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axiosInstance.get(`/codereviews/${id}`);
        const review = response.data.data;
        setTitle(review.title);
        setCategory(review.category);
        setContents(review.contents);
        setCode(review.code);
      } catch (error) {
        console.error('Error fetching the code review:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch code review details.';
        alert(errorMessage);
      }
    };
    fetchReview();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    const updatedReview = {
      title,
      category,
      contents,
      code
    };

    if (isSubmitting) return; // 이미 제출 중이면 아무 작업도 하지 않음
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(`/codereviews/${id}`, updatedReview);
      const { message } = response.data;
      alert(message);
      navigate(`/codereviews/${id}`); // 수정된 리뷰 페이지로 이동
    } catch (error) {
      console.error('Error updating code review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update code review. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false); // 제출 상태를 false로 변경
    }
  };

  const handleBack = () => {
    navigate(`/codereviews/${id}`); // 리뷰 상세 페이지로 이동
  };

  return (
      <div className="code-review-edit-container">
        <Nav /> {/* 여기에 Nav 컴포넌트를 추가합니다. */}
        <div className="white-box">
          <h2>코드 리뷰 수정</h2>
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
            <div className="form-buttons">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : '수정하기'}
              </button>
              <button type="button" className="back-btn" onClick={handleBack}>
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CodeReviewEdit;
