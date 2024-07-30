import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav'; // Nav 컴포넌트를 가져옵니다.
import './CodeReviewDetail.css';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    Authorization: `${localStorage.getItem('accessToken')}`
  }
});

const CodeReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [currentCommentsPage, setCurrentCommentsPage] = useState(1);
  const commentsPerPage = 5;
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/codereviews/${id}`);
        setReview(response.data.data);
      } catch (error) {
        console.error('Error fetching the code review:', error);
      }
    };
    fetchReview();
  }, [id]);

  const handlePageClick = (pageNumber) => {
    setCurrentCommentsPage(pageNumber);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/codereviews/${id}`);
      if (response.status === 200) {
        alert(response.data.message);
        navigate('/codereviews');
      } else {
        alert(response.data.message || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleEdit = () => {
    navigate(`/codereviews/${id}/edit`); // 리뷰 수정 페이지로 이동
  };

  const handleLikeClick = async (commentId) => {
    try {
      // 서버에 LIKE 요청 보내기
      const response = await axios.post(`http://localhost:8080/api/codereviews/${id}/comments/${commentId}/like`);
      if (response.status === 200) {
        await fetchReview(); // 댓글 상태 최신화
      } else {
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEditClick = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(currentContent);
  };

  const handleSaveClick = async (commentId) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/codereviews/${id}/comments/${commentId}`, {
        contents: editedCommentContent,
      });
      if (response.status === 200) {
        await fetchReview(); // 댓글 상태 최신화
        setEditingCommentId(null);
      } else {
        alert(response.data.message || '댓글 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '댓글 수정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (isSubmitting) return; // 이미 제출 중이면 아무 작업도 하지 않음
    setIsSubmitting(true);

    try {
      // 댓글 작성 요청
      const response = await axios.post(`http://localhost:8080/api/codereviews/${id}/comments`, {
        contents: newComment
      });

      // 댓글 작성 성공 후 데이터 최신화
      await fetchReview(); // 최신 데이터 가져오기

      setNewComment(''); // 댓글 작성 후 입력 필드 초기화

      // 성공 알림
      alert('댓글이 작성되었습니다.');
    } catch (error) {
      console.error('댓글 작성 중 오류가 발생했습니다:', error);
    } finally {
      setIsSubmitting(false); // 제출 상태를 false로 변경
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      const response = await axios.delete(`http://localhost:8080/api/codereviews/${id}/comments/${commentId}`);
      if (response.status === 200) {
        await fetchReview(); // 댓글 상태 최신화
        alert(response.data.message); // JSON 응답의 메시지를 알럿으로 표시
      } else {
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '댓글 삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const fetchReview = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/codereviews/${id}`);
      setReview(response.data.data);
    } catch (error) {
      console.error('Error fetching the code review:', error);
    }
  };

  if (!review) {
    return <div>Loading...</div>;
  }

  const {
    title,
    name,
    category,
    contents,
    code,
    createdAt,
    comments
  } = review;

  const paginatedComments = comments.slice(
      (currentCommentsPage - 1) * commentsPerPage,
      currentCommentsPage * commentsPerPage
  );

  const handleBack = () => {
    navigate('/codereviews'); // 뒤로가기 버튼 클릭 시 코드 리뷰 목록으로 이동
  };

  return (
      <div className="code-review-detail-container">
        <Nav /> {/* 여기에 Nav 컴포넌트를 추가합니다. */}
        <div className="white-box">
          <div className="header-section">
            <h2>{title}</h2>
            <div className="action-buttons">
              <button className="edit-button" onClick={handleEdit}>수정하기</button>
              <button className="delete-button" onClick={handleDelete}>삭제하기</button>
            </div>
          </div>
          <div className="detail-field">
            <span className="field-name">작성자&nbsp;</span> {name}
          </div>
          <div className="detail-field">
            <span className="field-name">카테고리&nbsp;</span> <span className="category">{category}</span>
          </div>
          <div className="detail-field">
            <span className="field-name">작성일&nbsp;</span> {new Date(createdAt).toLocaleString()}
          </div>
          <div className="detail-field detail-contents">
            <span className="field-name">내용</span>
            <div className="contents-text">{contents}</div>
          </div>
          <div className="detail-field detail-code">
            <pre>{code}</pre>
          </div>

          <div className="comments-section">
            {paginatedComments.length > 0 ? (
                paginatedComments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-content">
                        <span className="comment-name">{comment.name}</span>
                        {editingCommentId === comment.id ? (
                            <div className="edit-comment-container">
                      <textarea
                          className="edit-textarea"
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                          rows="4"
                      />
                              <div className="edit-comment-buttons">
                                <button
                                    className="save-comment-button"
                                    onClick={() => handleSaveClick(comment.id)}
                                >
                                  확인
                                </button>
                                <button
                                    className="delete-comment-button"
                                    onClick={() => handleCommentDelete(comment.id)}
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                        ) : (
                            <div className="comment-text-container">
                              <span className="comment-contents">{comment.contents}</span>
                              <button
                                  className="edit-comment-button"
                                  onClick={() => handleEditClick(comment.id, comment.contents)}
                              >
                                EDIT🖉
                              </button>
                            </div>
                        )}
                      </div>
                      <div className="comment-footer">
                        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                        <button
                            className="like-button"
                            onClick={() => handleLikeClick(comment.id)}
                        >
                          {comment.likes} LIKE♥️
                        </button>
                      </div>
                    </div>
                ))
            ) : (
                <p>댓글이 없습니다.</p>
            )}

            <div className="pagination">
              {Array.from(
                  { length: Math.ceil(comments.length / commentsPerPage) },
                  (_, index) => (
                      <span
                          key={index}
                          className={`page-number ${currentCommentsPage === index + 1 ? 'current' : ''}`}
                          onClick={() => handlePageClick(index + 1)}
                      >
                  {index + 1}
                </span>
                  )
              )}
            </div>

            <div className="new-comment-section">
            <textarea
                id="new-comment-textarea"
                className="new-comment-textarea"
                value={newComment}
                onChange={handleNewCommentChange}
                rows="3"
                placeholder="댓글을 작성하세요"
            />
              <button
                  className="submit-comment-button"
                  onClick={handleAddComment}
                  disabled={isSubmitting}
              >
                {isSubmitting ? '등록 중' : '작성'}
              </button>
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" className="back-btn" onClick={handleBack}>뒤로가기</button>
          </div>
        </div>
      </div>
  );
};

export default CodeReviewDetail;
