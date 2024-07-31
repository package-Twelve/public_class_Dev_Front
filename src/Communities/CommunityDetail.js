import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CommunityDetail.css';
import Nav from "../Nav";

const DetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch post data
  const fetchPostData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/community/${id}`);
      console.log(response);
      setPost(response.data.data);
      setComments(response.data.data.comments || []);
    } catch (err) {
      setError('Failed to fetch post data.');
      console.error('Error fetching post data:', err);
    }
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
    console.log('Comment Text:', commentText);
    try {
      const response = await axios.post(`http://localhost:8080/api/community/${id}/comments`, { contents: commentText }, {
        headers: {
          Authorization: `${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Server Response:', response.data);
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

  const handleEditPost = () => {
    navigate(`/community/update/${id}`);
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
                  comments.map((comment, index) => (
                      <div className="comment" key={index}>
                        <p className="comment-content">{comment.content || 'No Content'}</p>
                      </div>
                  ))
              ) : (
                  <p>댓글이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default DetailComponent;
