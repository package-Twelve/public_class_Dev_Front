import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../Nav';
import './CodeReviewEdit.css';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
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
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axiosInstance.get(`/codereviews/${id}`);
        const review = response.data.data;
        setTitle(review.title);
        setCategory(review.category);
        setContents(review.contents);
        setCode(review.code);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch code review details.';
        setError(errorMessage);
        setLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    };
    fetchReview();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedReview = {
      title,
      category,
      contents,
      code
    };

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(`/codereviews/${id}`, updatedReview);
      const { message } = response.data;
      alert(message);
      navigate(`/codereviews/${id}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update code review. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/codereviews/${id}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
      <div className="code-review-edit-container">
        <Nav />
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
