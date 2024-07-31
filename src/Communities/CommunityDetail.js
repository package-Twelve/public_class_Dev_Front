import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CommunityDetail.css';
import Nav from "../Nav";

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
      setError('Failed to fetch post data.');
      console.error('Error fetching post data:', err);
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
      alert('Comment added successfully.');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
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
        alert('Post updated successfully.');
        await fetchPostData();
      } catch (error) {
        console.error('Error updating post:', error);
        alert('Failed to update post.');
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
        navigate('/community'); // Redirect to community list or home
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
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
      alert('Comment updated successfully.');
      await fetchPostData();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment.');
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
        alert('Comment deleted successfully.');
        await fetchPostData(); // Refresh comments after deletion
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Failed to delete comment.');
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(totalComments / PAGE_SIZE)) return;
    setCurrentPage(newPage);
    fetchComments(post.comments, newPage);
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
        <div className="article-container">
          <div className="article-header">
            <h1 className="article-title">{post.title || 'No Title'}</h1>
            <p className="article-info">
              작성자: {post.name || 'Unknown'} | 작성일: {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown'} | 카테고리: {post.category || 'Unknown'}
            </p>
          </div>

          <div className="article-content">
            <p>{post.content || 'No Content Available'}</p>
            <div className="post-actions">
              <button onClick={handleEditPost}>게시글 수정</button>
              <button onClick={handleDeletePost}>게시글 삭제</button>
            </div>
          </div>

          <div className="comments-section">
            <h3>댓글</h3>
            <div className="comment-form">
            <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="댓글을 입력하세요..."
                rows="4"
            ></textarea>
              <button onClick={handleAddComment} disabled={isSubmitting}>댓글 작성</button>
            </div>
            <div className="comments">
              {comments.length > 0 ? (
                  comments.map((comment) => (
                      <div className="comment" key={comment.commentId}>
                        <p className="comment-content">{comment.content || 'No Content'}</p>
                        <button onClick={() => handleEditComment(comment.commentId, comment.content)}>댓글 수정</button>
                        <button onClick={() => handleDeleteComment(comment.commentId)}>댓글 삭제</button>
                      </div>
                  ))
              ) : (
                  <p>댓글이 없습니다.</p>
              )}
            </div>
            <div className="pagination">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>이전</button>
              <span>페이지 {currentPage} / {Math.ceil(totalComments / PAGE_SIZE)}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= Math.ceil(totalComments / PAGE_SIZE)}>다음</button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default DetailComponent;
