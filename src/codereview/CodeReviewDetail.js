import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav';
import './CodeReviewDetail.css';
import reissueToken from "../reissueToken";

const axiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `${localStorage.getItem('accessToken')}`
  }
});

const CodeReviewDetail = () => {
  const {id} = useParams();
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
        const response = await axios.get(
            `/api/codereviews/${id}`);
        setReview(response.data.data);
      } catch (error) {
      }
    };
    fetchReview();
  }, [id]);

  const handlePageClick = (pageNumber) => {
    setCurrentCommentsPage(pageNumber);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(
          `/api/codereviews/${id}`);
      if (response.status === 200) {
        alert(response.data.message);
        const pointResponse = await axios.patch('/api/users/points',
          {
            point : '10', 
            type : 'SUBTRACT'
          });
        navigate('/codereviews');
      } else {
        alert(response.data.message || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
      if(error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        reissueToken(error);
      }
      const errorMessage = error.response?.data?.message
          || '알 수 없는 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleEdit = () => {
    navigate(`/codereviews/${id}/edit`);
  };

  const handleLikeClick = async (commentId) => {
    try {
      const response = await axios.post(
          `/api/codereviews/${id}/comments/${commentId}/like`);
      if (response.status === 200) {
        await fetchReview();
      } else {
        alert('좋아요 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      if(error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        reissueToken(error);
      }
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleEditClick = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(currentContent);
  };

  const handleSaveClick = async (commentId) => {
    try {
      const response = await axios.put(
          `/api/codereviews/${id}/comments/${commentId}`, {
            contents: editedCommentContent,
          });
      if (response.status === 200) {
        await fetchReview();
        setEditingCommentId(null);
      } else {
        alert(response.data.message || '댓글 수정 중 오류가 발생했습니다.');
      }
    } catch (error) {
      if(error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        reissueToken(error);
      }
      const errorMessage = error.response?.data?.message
          || '댓글 수정 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleNewCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(
          `/api/codereviews/${id}/comments`, {
            contents: newComment
          });

      await fetchReview();

      setNewComment('');

      alert('댓글이 작성되었습니다.');
      const pointResponse = await axios.patch('/api/users/points', 
        {
          point : '10', 
          type : 'ADD'
        });
    } catch (error) {
      if (error.response && error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        await reissueToken(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm('댓글을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(
          `/api/codereviews/${id}/comments/${commentId}`);
      if (response.status === 200) {
        await fetchReview();
        alert(response.data.message);
        const pointResponse = await axios.patch('/api/users/points', 
          {
            point : '10', 
            type : 'SUBTRACT'
          });
      } else {
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      if(error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        reissueToken(error);
      }
      const errorMessage = error.response?.data?.message
          || '댓글 삭제 중 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const fetchReview = async () => {
    try {
      const response = await axios.get(
          `/api/codereviews/${id}`);
      setReview(response.data.data);
    } catch (error) {
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
    navigate('/codereviews');
  };

  return (
      <div className="code-review-detail-container">
        <Nav/>
        <div className="white-box">
          <div className="header-section">
            <div className="header-container">
              <h2>{title}</h2>
              <p className="header-info">
                작성자 : {name} | 작성일 : {new Date(createdAt).toLocaleString()}
              </p>
              <p className="header-category"><span className="category-highlight">{category}</span></p>
            </div>

            <div className="action-buttons">
              <button className="edit-button" onClick={handleEdit}>수정하기</button>
              <button className="delete-button" onClick={handleDelete}>삭제하기
              </button>
            </div>
          </div>
          <div className="detail-field detail-contents">
            <div className="contents-text">{contents}</div>
          </div>
          <div className="detail-field detail-code">
            <pre>{code}</pre>
          </div>

          <div className="comments-section">
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
                          onChange={(e) => setEditedCommentContent(
                              e.target.value)}
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
                                    onClick={() => handleCommentDelete(
                                        comment.id)}
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                        ) : (
                            <div className="comment-text-container">
                              <span
                                  className="comment-contents">{comment.contents}</span>
                              <button
                                  className="edit-comment-button"
                                  onClick={() => handleEditClick(comment.id,
                                      comment.contents)}
                              >
                                EDIT🖉
                              </button>
                            </div>
                        )}
                      </div>
                      <div className="comment-footer">
                        <span className="comment-date">{new Date(
                            comment.createdAt).toLocaleString()}</span>
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
                  {length: Math.ceil(comments.length / commentsPerPage)},
                  (_, index) => (
                      <span
                          key={index}
                          className={`page-number ${currentCommentsPage
                          === index + 1 ? 'current' : ''}`}
                          onClick={() => handlePageClick(index + 1)}
                      >
                  {index + 1}
                </span>
                  )
              )}
            </div>


          </div>

          <div className="form-buttons">
            <button type="button" className="back-btn"
                    onClick={handleBack}>뒤로가기
            </button>
          </div>
        </div>
      </div>
  );
};

export default CodeReviewDetail;
