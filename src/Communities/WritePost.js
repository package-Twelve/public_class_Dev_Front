import React, { useState } from 'react';
import './WritePost.css'; // Import the CSS file

const WritePost = () => {
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
    if (title && category && content) {
      try {
        const backendCategory = categoryMapping[category];
        const postData = { title, content, category: backendCategory };

        const response = await fetch('http://localhost:8080/api/community', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        });

        if (response.ok) {
          alert('게시글이 성공적으로 등록되었습니다.');
          window.location.href = '/community';
        } else {
          alert('게시글 등록에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('게시글 등록 중 오류가 발생했습니다.');
      }
    } else {
      alert('모든 필드를 채워주세요.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성 중인 내용이 저장되지 않습니다. 정말 취소하시겠습니까?')) {
      window.location.href = '/community';
    }
  };

  return (
      <div className="write-post-container">
        <h1 className="write-post-title">새 글 작성하기</h1>
        <form className="write-post-form" onSubmit={handleSubmit}>
          <div className="write-post-form-group">
            <label className="write-post-label" htmlFor="title">제목</label>
            <input
                type="text"
                id="title"
                name="title"
                className="write-post-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="제목을 입력하세요"
            />
          </div>

          <div className="write-post-form-group">
            <label className="write-post-label" htmlFor="category">카테고리</label>
            <select
                id="category"
                name="category"
                className="write-post-select"
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

          <div className="write-post-form-group">
            <label className="write-post-label" htmlFor="content">내용</label>
            <textarea
                id="content"
                name="content"
                className="write-post-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="내용을 입력하세요"
            ></textarea>
          </div>

          <div className="write-post-button-group">
            <button
                type="button"
                className="write-post-cancel-button"
                onClick={handleCancel}
            >
              취소
            </button>
            <button type="submit" className="write-post-submit-button">
              등록
            </button>
          </div>
        </form>
      </div>
  );
};

export default WritePost;
