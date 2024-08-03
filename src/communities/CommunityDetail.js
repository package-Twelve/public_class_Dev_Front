import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from './CommunityDetail.module.css'; // CSS Module import
import Nav from "../Nav";
import reissueToken from "../reissueToken";

const PAGE_SIZE = 3; // Number of comments per page

const DetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);

  const fetchPostData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/community/${id}`);
      setPost(response.data.data);
      setTotalComments(response.data.data.comments?.length || 0);
      fetchComments(response.data.data.comments, currentPage); // Fetch comments for the current page
    } catch (err) {
      setError('게시글을 가져올 수 없습니다.');
      console.error('Error fetching post data:', err);
      if (err.response.data.statusCode === 401 && err.response.data.message === "토큰이 만료되었습니다.") {
        await reissueToken(err);
      }
    }
  };

  const fetchComments = async (allComments, page) => {
    const offset = (page - 1) * PAGE_SIZE;
    const commentsToDisplay = allComments.slice(offset, offset + PAGE_SIZE);
    setComments(commentsToDisplay);
  };

  useEffect(() => {
    fetchPostData(); // Fetch data on component mount
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert('댓글을 작성해주세요.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');

    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:8080/api/community/${id}/comments`, { contents: commentText }, {
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      setCommentText('');
      await fetchPostData();
      alert('댓글이 작성되었습니다.');
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
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('댓글이 작성되지 못하였습니다.');
      if (error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        await reissueToken(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPost = async () => {
    const newContent = prompt('Edit the post content:', post.content);
    if (newContent !== null && newContent.trim() !== '') {
      const accessToken = localStorage.getItem('accessToken');
      try {
        await axios.put(`http://localhost:8080/api/community/${id}`, { content: newContent }, {
          headers: {
            Authorization: `${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        alert('게시글이 수정되었습니다.');
        await fetchPostData();
      } catch (error) {
        console.error('Error updating post:', error);
        if (error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
          await reissueToken(error);
        }
        else if(error.response.data.message === "권한이 없습니다."){
          alert('게시물을 수정할 수 없습니다.');
        }
      }
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('게시글을 삭제하시겠습니까?')) {
      const accessToken = localStorage.getItem('accessToken');

      try {
        await axios.delete(`http://localhost:8080/api/community/${id}`, {
          headers: {
            Authorization: `${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        alert('Post deleted successfully.');
        const pointResponse = await axios.patch('http://localhost:8080/api/users/points', 
          {
            point : '10', 
            type : 'SUBTRACT'
          }, 
          {
          headers: {
            Authorization: `${accessToken}`
          }
        });
        navigate('/community'); // Redirect to community list or home
      } catch (error) {
        console.error('Error deleting post:', error);
        if (error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
          await reissueToken(error);
        }
        else if(error.response.data.message === "권한이 없습니다."){
          alert('게시물을 삭제할 수 없습니다.');
        }
      }
    }
  };

  const handleEditComment = (commentId, currentText) => {
    const newText = prompt('Edit your comment:', currentText);
    if (newText !== null && newText.trim() !== '') {
      setEditingCommentId(commentId);
      setEditingCommentText(newText);
      handleSaveComment(commentId, newText);
    }
  };

  const handleSaveComment = async (commentId, newText) => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      await axios.put(`http://localhost:8080/api/community/${id}/comments/${commentId}`, { contents: newText }, {
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      alert('댓글이 수정되었습니다.');
      await fetchPostData();
    } catch (error) {
      console.error('Error updating comment:', error);
      if (error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
        await reissueToken(error);
      }
      else if(error.response.data.message === "권한이 없습니다."){
        alert('댓글을 수정할 수 없습니다.');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      const accessToken = localStorage.getItem('accessToken');

      try {
        await axios.delete(`http://localhost:8080/api/community/${id}/comments/${commentId}`, {
          headers: {
            Authorization: `${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        alert('댓글이 삭제되었습니다.');
        await fetchPostData();
        const pointResponse = await axios.patch('http://localhost:8080/api/users/points', 
          {
            point : '10', 
            type : 'SUBTRACT'
          }, 
          {
          headers: {
            Authorization: `${accessToken}`
          }
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        if (error.response.data.statusCode === 401 && error.response.data.message === "토큰이 만료되었습니다.") {
          await reissueToken(error);
        }
        alert('댓글을 삭제할 수 없습니다.');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalComments / PAGE_SIZE)) return;
    setCurrentPage(newPage);
    fetchComments(post.comments, newPage);
  };

  const handleBack = () => {
    navigate('/community'); // 뒤로가기 버튼 클릭 시 코드 리뷰 목록으로 이동
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
      <div>
        <Nav />
        <div className={style["article-container"]}>
          <div className={style["article-header"]}>
            <div className={style["article-header-container"]}>
              <h1 className={style["article-title"]}>{post.title
                  || 'No Title'}</h1>
              <p className={style["article-info"]}>
                작성자: {post.name || 'Unknown'} | 작성일: {post.createdAt ? new Date(
                  post.createdAt).toLocaleDateString() : 'Unknown'} |
                카테고리: {post.category || 'Unknown'}
              </p>
            </div>
            <div className={style["post-actions"]}>
              <button onClick={handleEditPost}>수정</button>
              <button onClick={handleDeletePost}>삭제</button>
            </div>
          </div>

          <div className={style["article-content"]}>
            <p>{post.content || 'No Content Available'}</p>

          </div>

          <div className={style["comments-section"]}>
            <h3>댓글</h3>
            <div className={style["comment-form"]}>
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows="4"
            ></textarea>
              <button onClick={handleAddComment} disabled={isSubmitting}>댓글 작성
              </button>
            </div>
            <div className={style.comments}>
              {comments.length > 0 ? (
                  comments.map((comment) => (
                      <div className={style["comment"]} key={comment.commentId}>
                        <div className={style["comment-container"]}>
                          <p className={style["comment-content"]}>{comment.content
                              || 'No Content'}</p>
                        </div>
                        <div className={style["comment-button-container"]}>
                          <button onClick={() => handleEditComment(
                              comment.commentId, comment.content)}>수정
                          </button>
                          <button onClick={() => handleDeleteComment(
                              comment.commentId)}>삭제
                          </button>
                        </div>
                      </div>
                  ))
              ) : (
                  <p>댓글이 없습니다.</p>
              )}
            </div>
            <div className={style.pagination}>
              <button onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}>이전
              </button>
              <span>페이지 {currentPage} / {Math.ceil(
                  totalComments / PAGE_SIZE)}</span>
              <button onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(
                          totalComments / PAGE_SIZE)}>다음
              </button>
            </div>
          </div>
          <div className={style[["form-buttons"]]}>
            <button type="button" className={style["back-btn"]}
                    onClick={handleBack}>뒤로가기
            </button>
          </div>
        </div>
      </div>
  );
};

export default DetailComponent;
